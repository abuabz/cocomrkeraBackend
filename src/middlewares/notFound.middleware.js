const ApiResponse = require('../utils/apiResponse');

const notFoundHandler = (req, res, next) => {
    return ApiResponse.error(res, 'Resource not found', null, 404);
};

module.exports = notFoundHandler;
