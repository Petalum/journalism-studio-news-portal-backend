const ApiError = require('../error/apiError');
const userService = require('../service/userService');
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

/** Controller for working with users. */
class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }
            const userData = await userService.registration(req.body);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }


    async check(req, res, next) {
        const { id } = req.query;
        if (!id) {
            next(ApiError.badRequest('Не задан id'));
        }
        res.json(id);
    }
}

module.exports = new UserController();