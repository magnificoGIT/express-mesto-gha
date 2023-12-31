const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/constants');
const NotFoundError = require('../utils/errors/notFoundError');
const { OK_200, CREATED_201 } = require('../utils/httpStatusConstants');

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
    .then((user) => {
      const { _id } = user;
      res.status(CREATED_201).send({
        _id,
        name,
        about,
        avatar,
        email,
      });
    })
    .catch(next);
};

// Универсальнная функция для обновления данных профиля пользователя
const updateProfileFields = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (about) updateData.about = about;
  if (avatar) updateData.avatar = avatar;

  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      const userData = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.status(OK_200).send(userData);
    })
    .catch(next);
};

// Функция декоратор для обновления полей name и about
const updateProfile = updateProfileFields;

// Функция декоратор для обновления поля avatar
const updateAvatar = updateProfileFields;

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // res.cookie('jwt', token, {
      //   httpOnly: true,
      //   sameSite: true,
      //   maxAge: 3600000,
      // });
      // res.send({ message: 'Вы вошли' });
      res.status(200).send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findOne({ _id: req.user })
    .orFail(() => new NotFoundError('Такой пользователь не найден'))
    .then((user) => {
      res.send(user);
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
  getCurrentUser,
};
