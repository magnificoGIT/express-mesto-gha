const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/constants');
const NotFoundError = require('../utils/errors/notFoundError');
const UnauthorizedError = require('../utils/errors/unauthorized');
const { OK_200 } = require('../utils/httpStatusConstants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Данный пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(OK_200).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(next);
};

// Универсальнная функция для обновления данных профиля пользователя
const updateDataUser = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.status(OK_200).send({ data: user }))
    .catch(next);
};

// Функция декоратор для обновления полей name и about
const updateProfile = (req, res) => {
  const { name, about } = req.body;

  updateDataUser(req, res, { name, about });
};

// Функция декоратор для обновления поля avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  updateDataUser(req, res, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => {
      if (!user) {
        throw UnauthorizedError('Неверно передан логин или пароль');
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw UnauthorizedError('Неверно передан логин или пароль');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          );

          res
            .cookie('token', token, {
              httpOnly: true,
              maxAge: 3600000,
              sameSite: true, // Ограничение на кросс-доменные запросы
              secure: NODE_ENV === 'production', // Устанавливаем, если работаем в production
            })
            .status(OK_200)
            .send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
