const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        Id: {
          type: Sequelize.STRING(50),
          primaryKey: true,
        },
        password: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        mbti: {
          type: Sequelize.STRING(50),
          allowNull: false,
        }
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "User",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = User;