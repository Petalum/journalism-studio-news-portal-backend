/**
 * A class for handling errors returned by the server.
 */
class ApiError extends Error {
    constructor(status, message, errors=[]) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    static badRequest(message, errors=[]) {
        return new ApiError(404, message, errors);
    }

    static internal(message, errors=[]) {
        return new ApiError(500, message, errors);
    }

    static forbidden(message) {
        return new ApiError(403, message);
    }

    static unauthorized(message) {
        return new ApiError(401, message);
    }
}

module.exports = ApiError;