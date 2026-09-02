const jwt = require('jsonwebtoken');
const { Token } = require('../models/models');

/** Token management service. */
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY,
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET_KEY,
            { expiresIn: '30d' }
        );


        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } });
        if (tokenData) {
            const updatedData = await tokenData.update({ refreshToken });
            return updatedData;
        }

        const token = await Token.create({ userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { refreshToken } });
        return 'Токен удалён';
    }
}

module.exports = new TokenService();