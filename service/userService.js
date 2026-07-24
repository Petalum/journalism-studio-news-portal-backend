const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const mailService = require('../service/mailService');
const tokenService = require('../service/tokenService');
const UserDto = require('../dtos/userDto');

/** User management service. */
class UserService {
    /**
     * User registration method.
     * @param {Object} body - Request body
     * @returns {Object} - Tokens and user info.
     */
    async registration(body) {
        const { name, surname, patronymic, group, email, password, roleId } = body;
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
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const dto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...dto });
        await tokenService.saveToken(dto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: dto,
        }
    };
}

module.exports = new UserService();