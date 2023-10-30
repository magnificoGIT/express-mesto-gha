const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    required: {
      value: true,
      message: 'Поле name является обязательным',
    },
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Поле link является обязательным',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: {
      value: true,
      message: 'Поле owner является обязательным',
    },
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
