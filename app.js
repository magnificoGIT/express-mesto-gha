const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_404 } = require('./utils/constants');

const { PORT } = process.env;

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '6542bf360fce5b568e20f75c',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(ERROR_404).send({ message: 'Ошибка пути' });
});

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
