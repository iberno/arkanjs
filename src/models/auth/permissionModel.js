const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const PermissionModel = sequelize.define("Permission", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: "permissions" });

module.exports = { PermissionModel };
