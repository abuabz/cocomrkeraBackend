const ApiResponse = require('../utils/apiResponse');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = env.NODE_ENV === 'development' ? err.stack : null;

    return ApiResponse.error(res, message, errors, statusCode);
};

module.exports = errorHandler;
