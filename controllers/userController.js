const ApiError = require('../error/apiError');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Generate json web token.
 * @param {number} id User id
 * @param {string} email User email
 * @param {role} role User role
 * @returns {string} Token
 */
const createJwt = (id, email, role) => (jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
));

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password) {
                throw new Error('Неверно указан email или пароль');
            }
            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                throw new Error('Пользователь с таким email уже существует');
            }
            const hashPas = await bcrypt.hash(password, 5);
            const user = await User.create({ email, role, password: hashPas });
            const token = createJwt(user.id, email, role);
            return res.json({ token });
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res) {

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