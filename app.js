const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const NotFoundError = require('./utils/errors/notFoundError');
const auth = require('./middlewares/auth');

const { PORT, MONGO_URL } = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/loginAuth'));

app.use(auth);

app.use('/', require('./routes/index'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Ошибка пути'));
});

app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
