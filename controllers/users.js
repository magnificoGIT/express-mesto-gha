const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.status(201).send(users);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(404).send({
        message: 'Ошибка при получение пользователей',
      });
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error('NotFound'));

    return res.status(201).send(user);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(404).send({
        message: 'Пользователь с указанным _id не найден',
        ...err,
      });
    }
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });

    return res.status(201).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданные некорректные данные для создания пользователя',
        ...err,
      });
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;
    const updateProfileUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    ).orFail(new Error('NotFound'));

    return res.status(201).send(updateProfileUser);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(400).send({
        message:
          'Переданы некорректные данные при обновлении профиля пользователя',
      });
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updateUserAvatar = await User.findByIdAndUpdate(
      req.params._id,
      avatar,
      { new: true },
    );

    return res.status(201).send(updateUserAvatar);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(400).send({
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
