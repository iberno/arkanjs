const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { RoleModel } = require("./roleModel");

const RoleUserModel = sequelize.define("RoleUser", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "role_users" });

RoleUserModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });

module.exports = { RoleUserModel };
