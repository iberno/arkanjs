import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Role } from "./Role.js";

export const RoleUser = sequelize.define("RoleUser", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false }
});

RoleUser.belongsTo(Role, { foreignKey: "role_id", as: "role" });
