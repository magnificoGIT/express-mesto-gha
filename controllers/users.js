const User = require('../models/user');
const {
  ERROR_500,
  ERROR_400,
  ERROR_404,
  SUCCESSFUL_200,
  SUCCESSFUL_201,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' }));
};

const getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        return res.status(ERROR_400).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({
      message: 'Поля name, about, avatar являются обязательными',
    });
  }

  if (name.length < 2 || name.length > 30 || about.length < 2 || about.length > 30) {
    return res.status(400).send({
      message: 'Имя пользователя должно быть от 2 до 30 символов',
    });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESSFUL_201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Переданны некорректные данные для создания пользователя' });
      }
      next(err); // Если другие ошибки, передаем их обработчику ошибок Express
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({
      message: 'Поля name, about, avatar являются обязательными',
    });
  }

  if (name.length < 2 || name.length > 30 || about.length < 2 || about.length > 30) {
    return res.status(400).send({
      message: 'Имя пользователя должно быть от 2 до 30 символов',
    });
  }
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(SUCCESSFUL_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message:
              'Переданы некорректные данные при обновлении профиля пользователя',
        });
      }
      if (err.message === 'CastError') {
        return res.status(ERROR_404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.status(SUCCESSFUL_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
