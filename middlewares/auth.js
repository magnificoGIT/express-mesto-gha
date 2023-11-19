require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const tokenCookies = req.cookies.jwt;

  if (!tokenCookies) {
    return next(new UnauthorizedError('Вы не авторизованы'));
  }

  let payload;
  try {
    payload = jwt.verify(tokenCookies, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Вы не авторизованы'));
  }
  req.user = payload;

  return next();
};
