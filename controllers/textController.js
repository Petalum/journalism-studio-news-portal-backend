const uuid = require('uuid');
const path = require('path');
const { Text, User } = require('../models/models');
const ApiError = require('../error/apiError');
const { Op } = require('sequelize');

/** Controller for working with texts. */
class TextController {
    async createText(req, res, next) {
        try {
            const { body, title, dt_publish, dt_edit, authors_id } = req.body;
            const { img } = req.files;
            const fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const text = await Text.create({ body, title, dt_publish, dt_edit, img: fileName });

            const authors = await User.findAll({ where: { id: { [Op.or]: JSON.parse(authors_id) } } });
            if (authors && text) {
                authors.forEach((e) => { e.addText(text.id); });
            }

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