const Card = require('../models/card');
const {
  ERROR_500,
  ERROR_400,
  ERROR_404,
  SUCCESSFUL_200,
  SUCCESSFUL_201,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card
    .find({})
    .then((card) => res.send(card))
    .catch(() => res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.status(SUCCESSFUL_201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Переданны некорректные данные при создании карточки',
        });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.status(SUCCESSFUL_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Карточки не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(SUCCESSFUL_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

const dislikeCard = (req, res) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(SUCCESSFUL_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
