const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const { TextStatuses } = require('../constants');


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    patronymic: {type: DataTypes.STRING},
    group: {type: DataTypes.INTEGER},
    isActivated: {type: DataTypes.STRING, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
});

const Text = sequelize.define('text', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    body: {type: DataTypes.STRING, allowNull: false},
    likes_count: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    title: {type: DataTypes.STRING, allowNull: false},
    views_count: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    img: {type: DataTypes.STRING},
    dt_publish: {type: DataTypes.STRING},
    dt_edit: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, allowNull: false, defaultValue: TextStatuses.draft},
    categoryId: {type: DataTypes.INTEGER},
});

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    body: {type: DataTypes.STRING, allowNull: false},
    is_active: {type: DataTypes.BOOLEAN, allowNull: false},
    dt_publish: {type: DataTypes.STRING, allowNull: false},
    dt_create: {type: DataTypes.STRING, allowNull: false},
});

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const TextUser = sequelize.define('text_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, required: true},
});

Role.hasMany(User);
User.belongsTo(Role);

User.belongsToMany(Text, { through: TextUser, onDelete: 'CASCADE' });
Text.belongsToMany(User, { through: TextUser, onDelete: 'CASCADE' });

User.hasMany(Token);
Token.belongsTo(User);

Text.hasMany(Comment);
Comment.belongsTo(Text);

Text.hasMany(Category);
Category.belongsTo(Text);

module.exports = {
    User,
    Text,
    Role,
    Comment,
    Category,
    TextUser,
    Token,
}