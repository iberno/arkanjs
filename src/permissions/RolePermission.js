import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Role } from "../roles/Role.js";
import { Permission } from "./Permission.js";

export const RolePermission = sequelize.define("RolePermission", {
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false }
});

RolePermission.belongsTo(Role, { foreignKey: "role_id" });
RolePermission.belongsTo(Permission, { foreignKey: "permission_id" });
