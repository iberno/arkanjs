const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const UserModel = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: "users" });

module.exports = { UserModel };
