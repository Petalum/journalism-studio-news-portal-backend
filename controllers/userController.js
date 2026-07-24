const ApiError = require('../error/apiError');
const userService = require('../service/userService');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');

/** Controller for working with users. */
class UserController {
    async registration(req, res, next) {
        try {
            const userData = await userService.registration(req.body);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            let checkPassword = user ? bcrypt.compareSync(password, user.password) : null;
            if (!user || !checkPassword) {
                return next(ApiError.unauthorized('Указан неверный логин или пароль'));
            }
            const token = createJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async check(req, res, next) {
        const { id } = req.query;
        if (!id) {
            return next(ApiError.badRequest('Не задан id'));
        }
        res.json(id);
    }
}

module.exports = new UserController();