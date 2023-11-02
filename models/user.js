const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" обязательно для заполнения'],
    minlength: [2, 'Минимальная длина поля "about" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "about" - 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" обязательно для заполнения'],
  },
});

module.exports = mongoose.model('user', userSchema);
