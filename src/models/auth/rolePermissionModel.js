const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { RoleModel } = require("./roleModel");
const { PermissionModel } = require("./permissionModel");

const RolePermissionModel = sequelize.define("RolePermission", {
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "role_permissions" });

RolePermissionModel.belongsTo(RoleModel, { foreignKey: "role_id" });
RolePermissionModel.belongsTo(PermissionModel, { foreignKey: "permission_id" });

module.exports = { RolePermissionModel };
