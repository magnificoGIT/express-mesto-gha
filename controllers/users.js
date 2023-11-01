const User = require('../models/user');
const {
  ERROR__500,
  ERROR__400,
  ERROR__404,
  SUCCESSFUL__200,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.send(users);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(ERROR__500).send({
        message: 'Ошибка при получение пользователей',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(ERROR__404).send({
        message: 'Некорректный формат _id пользователя',
      });
    }
    const user = await User.findById(userId).orFail(new Error('NotFound'));
    return res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(ERROR__400).send({
        message: 'Пользователь с указанным _id не найден',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(ERROR__400).send({
        message: 'Пользователь с таким именем уже существует',
      });
    }

    const newUser = await User.create({ name, about, avatar });
    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR__400).send({
        message: 'Переданные некорректные данные для создания пользователя',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    if (!userId) {
      return res
        .status(ERROR__404)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }

    const updateProfileUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(new Error('NotFound'));

    return res.send(updateProfileUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR__400).send({
        message:
          'Переданы некорректные данные при обновлении профиля пользователя',
      });
    }
    if (err.message === 'NotFound') {
      return res.status(ERROR__404).send({
        message: 'Пользователь с указанным _id не найден',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id; // Используем _id пользователя, который вошел в систему
    const updatedUserAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!updatedUserAvatar) {
      return res.status(ERROR__404).send({
        message: 'Пользователь с указанным _id не найден',
      });
    }

    return res.sendStatus(SUCCESSFUL__200);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR__400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
