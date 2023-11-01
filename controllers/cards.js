const Card = require('../models/card');
const {
  ERROR__500,
  ERROR__400,
  ERROR__404,
  SUCCESSFUL__200,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});

    return res.status(SUCCESSFUL__200).send(cards);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(ERROR__500).send({
        message: 'Ошибка при получение карточек',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const createCardUser = await Card.create({ name, link, owner });

    return res.send(createCardUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR__400).send({
        message: 'Переданны некорректные данные при создании карточки',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const deleteCardUser = await Card.findByIdAndDelete(cardId).orFail(new Error('NotFound'));
    if (!deleteCardUser) {
      return res.status(ERROR__404).send({ message: 'Карточка не найдена' });
    }

    return res.sendStatus(SUCCESSFUL__200);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(ERROR__400).send({
        message: 'Ошибка при удалении карточки',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
      .orFail(new Error('NotFound'));
    if (!like) {
      return res.status(ERROR__404).send({ message: 'Карточка не найдена' });
    }

    return res.sendStatus(200);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(ERROR__400).send({
        message: 'Не удалось поставить лайк на карточку',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card
      .findOneAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
      .orFail(new Error('NotFound'));
    if (!dislike) {
      return res.status(ERROR__404).send({ message: 'Карточки не найдена' });
    }

    return res.sendStatus(200);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(ERROR__400).send({
        message: 'Не удалось убрать лайк с карточки',
      });
    }
    return res.status(ERROR__500).send({ message: 'Что-то пошло не так' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
