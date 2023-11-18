const internalServer = require('../utils/errors/internalServer');
const statusConflict = require('../utils/errors/statusConflict');
const { BadRequestError } = require('../utils/errors/badRequest');

module.exports = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'BadRequestError') {
    return res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
  }

  if (err.code === 11000) {
    return res.status(statusConflict.statusCode).send({ message: statusConflict.message });
  }

  if (err.message === 'NotFoundPath') {
    res.status(400).send({
      message: 'Указанного пути не существует',
    });
    return;
  }

  internalServer(err, res);

  next();
};
