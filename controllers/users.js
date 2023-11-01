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
    .catch(() => res.status(ERROR__500).send({ message: 'Ошибка по умолчанию' }));
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
      if (err.message === 'CastError') {
        return res.status(ERROR__400).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(ERROR__500).send({ message: 'Ошибка по умолчанию' });
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  if (name.length < 2 || name.length > 30) {
    return res.status(400).send({
      message: 'Имя пользователя должно быть от 2 до 30 символов',
    });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESSFUL__201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR__400).send({ message: 'Переданны некорректные данные для создания пользователя' });
      }
      next(err); // Если другие ошибки, передаем их обработчику ошибок Express
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
      if (err.name === 'ValidationError') {
        return res.status(ERROR__400).send({
          message:
              'Переданы некорректные данные при обновлении профиля пользователя',
        });
      }
      if (err.message === 'CastError') {
        return res.status(ERROR__404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(ERROR__500).send({ message: 'Ошибка по умолчанию' });
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
      return res.status(ERROR__500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
