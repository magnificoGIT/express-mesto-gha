const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { avatarUrlValidationPattern } = require('../utils/constants');

userRouter.get('/', getUsers);

userRouter.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

userRouter.get('/me', getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(avatarUrlValidationPattern),
  }),
}), updateAvatar);

module.exports = userRouter;
