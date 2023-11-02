const cardRoute = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoute.get('/', getCards);

cardRoute.post('/', createCard);

cardRoute.delete('/:cardId', deleteCard);

cardRoute.put('/:cardId/likes', likeCard);

cardRoute.delete('/:cardId/likes', dislikeCard);

module.exports = cardRoute;
