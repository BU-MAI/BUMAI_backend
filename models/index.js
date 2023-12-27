const Sequelize = require("sequelize");
const User = require("./User");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
});

db.sequelize = sequelize;

db.User = User;

User.initiate(sequelize);

User.associate(db);

module.exports = db;