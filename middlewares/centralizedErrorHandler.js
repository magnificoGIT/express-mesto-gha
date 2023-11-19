const internalServer = require('../utils/errors/internalServer');
const BadRequestError = require('../utils/errors/badRequest');
const NotFoundError = require('../utils/errors/notFoundError');
const UnauthorizedError = require('../utils/errors/unauthorized');
const ForbiddenError = require('../utils/errors/forbidden');

module.exports = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    console.log(err);
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(err.statusCode).send({ message: 'Данные уже существуют' });
  }

  if (err.message === 'NotFoundPath') {
    return res.status(400).send({ message: 'Указанного пути не существует' });
  }

  internalServer(err, res);

  next();
};
