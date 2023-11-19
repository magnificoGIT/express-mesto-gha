require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const tokenCookies = req.cookies.jwt;
  console.log(tokenCookies);

  if (!tokenCookies) {
    return next(new UnauthorizedError('Токен неверный'));
  }

  let payload;
  try {
    payload = jwt.verify(tokenCookies, JWT_SECRET);
  } catch (err) {
    console.log(err);
    return next(new UnauthorizedError('Токен неверный'));
  }
  req.user = payload;

  return next();
};
