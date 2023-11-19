const { NOT_FOUND_404 } = require('../httpStatusConstants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = NOT_FOUND_404;
  }
}

module.exports = NotFoundError;
