const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const mailService = require('../service/mailService');
const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../error/apiError');

/**
 * Create user dto and tokens. 
 * @param {Object} user User model.
 * @returns {Object} User info.
 */
const createUserInfo = async (user) => {
    const dto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...dto });
    await tokenService.saveToken(dto.id, tokens.refreshToken);

    return {
        ...tokens,
        user: dto,
    }
}

/** User management service. */
class UserService {
    /**
     * User registration method.
     * @param {Object} body Request body
     * @returns {Object} Tokens and user info.
     */
    async registration(body) {
        const { name, surname, patronymic, group, email, password, roleId } = body;
        if (!email || !password) {
            throw ApiError.badRequest('Неверно указан email или пароль');
        }
        const foundUser = await User.findOne({ where: { email } });
        if (foundUser) {
            throw ApiError.badRequest('Пользователь с таким email уже существует');
        }
        const hashPas = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();
        const user = await User.create({ name, surname, patronymic, group, email, roleId, password: hashPas, activationLink });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
        const info = createUserInfo(user);
        return info;
    };

    /**
     * User email activation method.
     * @param {string} activationLink Email activation link. 
     */
    async activate(activationLink) {
        const user = await User.findOne({ where: { activationLink } });
        if (!user) {
            throw ApiError.badRequest('Ссылка активации некорректна');
        }
        const activated = await user.update({ isActivated: true });
    }

    /**
     * User login method.
     * @param {string} email Email.
     * @param {string} password Password.
     * @returns {Object} User info and tokens list.
     */
    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        let checkPassword = user ? bcrypt.compareSync(password, user.password) : null;
        if (!user || !checkPassword) {
            throw ApiError.unauthorized('Указан неверный логин или пароль');
        }
        const info = createUserInfo(user);
        return info;
    }

    /**
     * User logout method.
     * @param {string} refreshToken Refresh token.
     * @returns {string} Refresh token.
     */
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
}

module.exports = new UserService();