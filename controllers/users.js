const User = require('../models/user');
const {
  ERROR__500,
  ERROR__400,
  ERROR__404,
  SUCCESSFUL__200,
  SUCCESSFUL__201,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR__500).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR__404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(ERROR__400).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.status(SUCCESSFUL__201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR__400).send({
          message: 'Переданные некорректные данные для создания пользователя',
        });
      }
      return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(userId, { new: true, runValidators: true }, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(ERROR__404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(SUCCESSFUL__200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(ERROR__404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR__400).send({
          message:
              'Переданы некорректные данные при обновлении профиля пользователя',
        });
      }
      return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User
    .findByIdAndUpdate(userId, { new: true, runValidators: true }, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(ERROR__404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(SUCCESSFUL__200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR__400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
