const User = require('../models/user');
const {
  ERROR__500,
  ERROR__400,
  ERROR__404,
  SUCCESSFUL__200,
} = require('../utils/constants');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.send(users);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(ERROR__500).send({
        message: 'Ошибка при получение пользователей',
      });
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params.userId;
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
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });

    return res.send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR__400).send({
        message: 'Переданные некорректные данные для создания пользователя',
      });
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
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
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
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
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
