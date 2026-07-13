const { Role } = require('../models/models');
const ApiError = require('../error/apiError');

/** Controller for working with user roles. */
class RoleController {
  async createRole(req, res, next) {
    try {
      const { name } = req.body;
      const role = await Role.create({ name });
      return res.json(role);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async changeRole(req, res, next) {
    try {
      const { id } = req.params;
      if (Number.isInteger(+id)) {
        const role = await Role.findByPk(id);
        if (role) {
          const updatedRole = await role.update({ name: req.body.name });
          return res.json(updatedRole);
        } else {
          throw new Error('Роль отсутствует');
        }
      } else {
        throw new Error('Идентификатор роли не указан');
      }
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const roles = await Role.findAll();
      return res.json(roles);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RoleController();