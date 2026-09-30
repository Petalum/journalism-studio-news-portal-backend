const ApiError = require('../error/apiError');

/**
 * Middleware for error server response.
 * @param {Object} err Error description.
 * @param {Object} req Request.
 * @param {Object} res Response.
 * @param {Object} next A callback function that passes control to the next link (middleware) in the request processing chain.
 * @returns {Object} Server response.
 */
function returnApiError(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }

    return res.status(500).json({ message: 'Непредвиденная ошибка сервера' });
}

module.exports = returnApiError;