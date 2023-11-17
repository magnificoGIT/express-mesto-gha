const badRequestError = require('../utils/errors/badRequest');
const statusConflict = require('../utils/errors/statusConflict');

module.exports = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(badRequestError.statusCode).send({ message: badRequestError.message });
  }

  if (err.name === 'BadRequestError') {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(statusConflict.statusCode).send({ message: statusConflict.message });
  }

  next();
};
