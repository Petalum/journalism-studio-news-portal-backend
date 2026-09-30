/** User Data Transfer Object. */
class UserDto {
    email;
    id;
    isActivated;
    roleCode;

    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.roleCode = model.roleCode;
    }
}

module.exports = UserDto;