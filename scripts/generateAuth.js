import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sequelize } from "../src/config/db.js";
dotenv.config();

export async function generateAuth() {
  const base = "src/models/auth";
  const authPaths = {
    models: base,
    controllers: "src/controllers/auth",
    middlewares: "src/middlewares/auth",
    routes: "src/routes/auth"
  };

  Object.values(authPaths).forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 👤 UserModel
  fs.writeFileSync(`${base}/userModel.js`, `import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { RoleModel } from "./roleModel.js";

export const UserModel = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: "users" });

UserModel.belongsToMany(RoleModel, {
  through: "role_users",
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles"
});
`);

  // 🔒 RoleModel
  fs.writeFileSync(`${base}/roleModel.js`, `import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { UserModel } from "./userModel.js";
import { PermissionModel } from "./permissionModel.js";

export const RoleModel = sequelize.define("Role", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: "roles" });

RoleModel.belongsToMany(UserModel, {
  through: "role_users",
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users"
});

RoleModel.belongsToMany(PermissionModel, {
  through: "role_permissions",
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions"
});
`);

  // 🔑 PermissionModel
  fs.writeFileSync(`${base}/permissionModel.js`, `import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { RoleModel } from "./roleModel.js";

export const PermissionModel = sequelize.define("Permission", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, { tableName: "permissions" });

PermissionModel.belongsToMany(RoleModel, {
  through: "role_permissions",
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles"
});
`);

  // 🔗 RoleUserModel
  fs.writeFileSync(`${base}/roleUserModel.js`, `import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { RoleModel } from "./roleModel.js";

export const RoleUserModel = sequelize.define("RoleUser", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "role_users" });

RoleUserModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });
`);

  // 🔗 RolePermissionModel
  fs.writeFileSync(`${base}/rolePermissionModel.js`, `import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";
import { RoleModel } from "./roleModel.js";
import { PermissionModel } from "./permissionModel.js";

export const RolePermissionModel = sequelize.define("RolePermission", {
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: "role_permissions" });

RolePermissionModel.belongsTo(RoleModel, { foreignKey: "role_id" });
RolePermissionModel.belongsTo(PermissionModel, { foreignKey: "permission_id" });
`);

  // 🛡️ authMiddleware.js
  fs.writeFileSync(`${authPaths.middlewares}/authMiddleware.js`, `import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado", details: err.message });
  }
}
`);

  // 🛡️ roleMiddleware.js
  fs.writeFileSync(`${authPaths.middlewares}/roleMiddleware.js`, `import { RoleUserModel } from "../../models/auth/roleUserModel.js";
import { RolePermissionModel } from "../../models/auth/rolePermissionModel.js";
import { PermissionModel } from "../../models/auth/permissionModel.js";

export function requireRole(roleName) {
  return async (req, res, next) => {
    const roleUser = await RoleUserModel.findOne({
      where: { user_id: req.user.id },
      include: ["role"]
    });

    if (!roleUser || roleUser.role?.name !== roleName) {
      return res.status(403).json({ error: "Acesso negado: cargo insuficiente" });
    }

    next();
  };
}

export function requirePermission(permissionName) {
  return async (req, res, next) => {
    const roleUser = await RoleUserModel.findOne({
      where: { user_id: req.user.id },
      include: ["role"]
    });

    if (!roleUser) return res.status(403).json({ error: "Usuário sem cargo associado" });

    const roleId = roleUser.role.id;

    const permission = await RolePermissionModel.findOne({
      where: { role_id: roleId },
      include: {
        model: PermissionModel,
        where: { name: permissionName }
      }
    });

    if (!permission) return res.status(403).json({ error: "Permissão negada" });

    next();
  };
}
`);

  // 🎯 authController.js
  fs.writeFileSync(`${authPaths.controllers}/authController.js`, `import { UserModel } from "../../models/auth/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user || !user.is_active) return res.status(404).json({ error: "Usuário inválido ou inativo" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ token });
  }
};
`);

  // 🌐 authRoute.js
  fs.writeFileSync(`${authPaths.routes}/authRoute.js`, `import express from "express";
import { authController } from "../../controllers/auth/authController.js";

const router = express.Router();
router.post("/login", authController.login);

export default router;
`);

  // 🌱 Seeds iniciais
  const { UserModel } = await import("../src/models/auth/userModel.js");
  const { RoleModel } = await import("../src/models/auth/roleModel.js");
  const { PermissionModel } = await import("../src/models/auth/permissionModel.js");
  const { RoleUserModel } = await import("../src/models/auth/roleUserModel.js");
  const { RolePermissionModel } = await import("../src/models/auth/rolePermissionModel.js");

  await sequelize.sync();

  const [adminUser] = await UserModel.findOrCreate({
    where: { email: "admin@arkan.dev" },
    defaults: {
      password: await bcrypt.hash("secret", 10),
      is_active: true
    }
  });

  const [dashboardRole] = await RoleModel.findOrCreate({ where: { name: "dashboard" } });
  const [managePermission] = await PermissionModel.findOrCreate({ where: { name: "manage_users" } });

  await RoleUserModel.findOrCreate({ where: { user_id: adminUser.id, role_id: dashboardRole.id } });
  await RolePermissionModel.findOrCreate({ where: { role_id: dashboardRole.id, permission_id: managePermission.id } });

  console.log("\n✅ Sistema de autenticação RBAC gerado com sucesso.");
  console.log("📂 Estrutura: models/auth/, controllers/auth/, middlewares/auth/, routes/auth/");
  console.log("👤 Usuário: admin@arkan.dev | Senha: secret");
  console.log("🔓 Rota pública disponível: POST /auth/login\n");
}
