const uuid = require('uuid');
const path = require('path');
const { Text, User, TextUser } = require('../models/models');
const ApiError = require('../error/apiError');
const { Op } = require('sequelize');
const sequelize = require('../db');


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
            if (authors.length && text) {
                authors.forEach((e) => { e.addText(text); });
            }

            return res.json(text);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async changeText(req, res) {
        try {
            const { id } = req.params;
            const { body, title, dt_publish, dt_edit, authors_id } = req.body;
            const { img } = req.files;
            const fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            if (Number.isInteger(+id)) {
                const text = await Text.findByPk(id);
                if (text) {
                    const updatedText = await text.update({ body, title, dt_publish, dt_edit, img: fileName });
                    const extraAuthors = await TextUser.destroy({
                        where:
                        {
                            userId: { [Op.not]: JSON.parse(authors_id) },
                            textId: text.id,
                        }
                    });

                    const authors = await User.findAll({ where: { id: { [Op.or]: JSON.parse(authors_id) } } });
                    if (authors.length) {
                        authors.forEach((e) => { e.addText(text); });
                    }

                    return res.json(updatedText);
                } else {
                    return next(ApiError.badRequest('Текст отсутствует'));
                }
            } else {
                return next(ApiError.badRequest('Идентификатор текста не указан'));
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

    async getAll(req, res) {
        try {
            let { limit, page, authorId, categoryId } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            let texts;

            if (!authorId && !categoryId) {
                texts = await Text.findAndCountAll({ limit, offset });
            }

            if (authorId && !categoryId) {
                const result = await Text.findAndCountAll({
                    limit,
                    offset,
                    include: {
                        model: User,
                        where: {
                            id: authorId,
                        },
                        attributes: [],
                    }
                });
                texts = result;
            }

            return res.json(texts);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res) {

    }

    async deleteOne(req, res) {

    }
}

module.exports = new TextController();