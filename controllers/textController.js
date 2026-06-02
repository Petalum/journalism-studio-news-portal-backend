const uuid = require('uuid');
const path = require('path');
const { Text } = require('../models/models');
const ApiError = require('../error/apiError');

/** Controller for working with texts. */
class TextController {
    async createText(req, res, next) {
        try {
            const { body, title } = req.body;
            const { img } = req.files;
            const fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const text = await Text.create({ body, title, img: fileName });
            return res.json(text);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async changeText(req, res) {

    }

    async getAll(req, res) {

    }

    async getOne(req, res) {

    }

    async deleteOne(req, res) {

    }
}

module.exports = new TextController();