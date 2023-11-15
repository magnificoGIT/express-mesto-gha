const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND_404 } = require('../utils/httpStatusConstants');

const rootRouter = express.Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/cards', cardRouter);
rootRouter.use('*', (req, res) => {
  res.status(NOT_FOUND_404).send({ message: 'Ошибка пути' });
});

module.exports = rootRouter;
