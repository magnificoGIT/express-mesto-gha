const Card = require('../models/card');
const {
  SUCCESSFUL_200,
  SUCCESSFUL_201,
} = require('../utils/httpStatusConstants');
const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbidden');

const getCards = (req, res, next) => {
  Card
    .find({})
    .then((card) => res.send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card
    .create({ name, link, owner })
    .then((card) => res.status(SUCCESSFUL_201).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Данная карточка не найдена'))
    .then((card) => {
      if (card.owner !== userId) {
        throw new ForbiddenError('Нельзя удалять карточку другого пользователя');
      }

      return Card.findByIdAndDelete(cardId).orFail(() => new NotFoundError('Данная карточка не найдена'));
    })
    .then((dataCard) => res.status(SUCCESSFUL_200).send({ data: dataCard }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError('Данная карточка не найдена'))
    .then((card) => res.status(SUCCESSFUL_200).send({ data: card }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => NotFoundError('Данная карточка не найдена'))
    .then((card) => res.status(SUCCESSFUL_200).send({ data: card }))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
