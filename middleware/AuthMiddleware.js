const ApiError = require('../error/apiError');
const tokenService = require('../service/tokenService');

/**
 * Middleware for user authorization check.
 * @param {Object} req Request.
 * @param {Object} res Response.
 * @param {Object} next A callback function that passes control to the next link (middleware) in the request processing chain.
 */
function checkUserAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unauthorized());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.unauthorized());
    }
}

module.exports = checkUserAuth;