const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/constants');
const NotFoundError = require('../utils/errors/notFoundError');
const { OK_200 } = require('../utils/httpStatusConstants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000,
      });
      res.send({ message: 'Вы вошли' });
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
