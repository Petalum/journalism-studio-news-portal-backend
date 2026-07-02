const {Role} = require('../models/models');
const ApiError = require('../error/apiError');

/** Controller for working with user roles. */
class RoleController {
    async createOne(req, res) {
        const {name} = req.body;
        const role = await Role.create({name});
        return res.json(role);
    }

     async changeOne(req, res, next) {
        const {id} = req.params;
        if (Number.isInteger(+id)) {
          const role = await Role.findByPk(id);
          if (role) {
            const updatedRole = await role.update({name: req.body.name});
            return res.json(updatedRole);
          } else {
            return next(ApiError.badRequest('Роль отсутствует'));
          }
        } else {
             return next(ApiError.badRequest('Идентификатор роли не указан'));
        }
    }

    async getAll(req, res) {
        res.json('123');
    }
}

module.exports = new RoleController();