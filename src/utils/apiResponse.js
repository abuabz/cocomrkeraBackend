class ApiResponse {
    constructor(statusCode, message, data = null, errors = null) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.timestamp = new Date().toISOString();
    }

    static success(res, message, data = null, statusCode = 200) {
        return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
    }

    static error(res, message, errors = null, statusCode = 500) {
        return res.status(statusCode).json(new ApiResponse(statusCode, message, null, errors));
    }
}

module.exports = ApiResponse;
