const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '654178dfce79b23fac532566',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
