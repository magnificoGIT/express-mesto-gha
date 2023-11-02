const mongoose = require('mongoose');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    required: [true, 'Поле "name" обязательно для заполнения'],
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: User,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
