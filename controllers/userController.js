const ApiError = require('../error/apiError');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const mailService = require('../service/mailService');
const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');

/** Controller for working with users. */
class UserController {
    async registration(req, res, next) {
        try {
            const { name, surname, patronymic, group, email, password, roleId } = req.body;
            if (!email || !password) {
                throw new Error('Неверно указан email или пароль');
            }
            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                throw new Error('Пользователь с таким email уже существует');
            }
            const hashPas = await bcrypt.hash(password, 5);
            const activationLink = uuid.v4();
            const user = await User.create({ name, surname, patronymic, group, email, roleId, password: hashPas, activationLink });
            await mailService.sendActivationMail(email, activationLink);
            const dto = new UserDto(user);
            const tokens = tokenService.generateTokens({...dto});
            await tokenService.saveToken(dto.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({ ...tokens, user: dto });
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