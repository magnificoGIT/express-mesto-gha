const { STATUS_CONFLICT_409 } = require('../httpStatusConstants');

class StatusConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CONFLICT_409;
  }
}

module.exports = new StatusConflictError('Пользователь с введенным email уже создан');
