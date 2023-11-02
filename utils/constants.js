const http2 = require('http2');

module.exports.ERROR_500 = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
module.exports.ERROR_404 = http2.constants.HTTP_STATUS_NOT_FOUND;
module.exports.ERROR_400 = http2.constants.HTTP_STATUS_BAD_REQUEST;
module.exports.SUCCESSFUL_200 = http2.constants.HTTP_STATUS_OK;
module.exports.SUCCESSFUL_201 = http2.constants.HTTP_STATUS_CREATED;
