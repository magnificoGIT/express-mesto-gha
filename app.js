const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const rootRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { avatarUrlValidationPattern } = require('./utils/constants');

const { PORT } = process.env;
const { MONGO_URL } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).min(30),
    avatar: Joi.string().pattern(avatarUrlValidationPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
app.use(express.json());
app.use('/', rootRouter);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
