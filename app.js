const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const NotFoundError = require('./utils/errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URL } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use('/', require('./routes/loginAuth'));

app.use('/', require('./routes/index'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Ошибка пути'));
});

app.use(errorLogger);

app.use(errors());
app.use(require('./middlewares/centralizedErrorHandler'));

app.listen(PORT);
