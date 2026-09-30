const ApiError = require('../error/apiError');
const tokenService = require('../service/tokenService');

/**
 * Middleware for user authorization check.
 * @param {Object} rolesList List of user roles that have access to the route's functionality.
 * @returns {Object} User authorization check function.
 */
function checkUserAuth(rolesList) {
    return function (req, res, next) {
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

             if (!rolesList.includes(userData.roleCode)) {
                return next(ApiError.forbidden());
             }

            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.unauthorized());
        }
    }
}

module.exports = checkUserAuth;