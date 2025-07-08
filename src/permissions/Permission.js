import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Permission = sequelize.define("Permission", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});
