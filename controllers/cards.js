const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});

    return res.status(200).send(cards);
  } catch (err) {
    if (err.name === 'SomeErrorName') {
      return res.status(404).send({
        message: 'Ошибка при получение карточек',
        ...err,
      });
    }
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const createCardUser = await Card.create({ name, link, owner });

    return res.status(201).send(createCardUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданны некорректные данные при создании карточки',
        ...err,
      });
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const deleteCardUser = await Card.findById(req.params.id).orFail(new Error('NotFound'));

    return res.status(201).send(deleteCardUser);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(500).send({
        message: 'Ошибка при удалении карточки',
      });
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card
      .findByIdAndUpdate(
        req.params._id,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
      .orFail(new Error('NotFound'));

    return res.status(200).send(like);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(500).send({
        message: 'Не удалось поставить лайк на карточку',
      });
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card
      .findOneAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
      .orFail(new Error('NotFound'));

    return res.status(200).send(dislike);
  } catch (err) {
    if (err.message === 'NotFound') {
      return res.status(500).send({
        message: 'Не удалось убрать лайк с карточки',
      });
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
