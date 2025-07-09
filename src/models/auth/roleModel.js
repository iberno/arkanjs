const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const RoleModel = sequelize.define("Role", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: "roles" });

module.exports = { RoleModel };
