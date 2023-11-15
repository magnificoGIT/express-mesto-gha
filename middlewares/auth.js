const jwt = require('jsonwebtoken');
const {
  ERROR_401,
} = require('../utils/httpStatusConstants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startswith('Bearer ')) {
    return res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(ERROR_401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
