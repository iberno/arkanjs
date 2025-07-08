import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sequelize } from "../src/config/db.js";
dotenv.config();

export async function generateAuth() {
  const modelDir = path.resolve("src/models");
  const controllerDir = path.resolve("src/controllers");
  const routeDir = path.resolve("src/routes");
  const middlewareDir = path.resolve("src/middlewares");

  [modelDir, controllerDir, routeDir, middlewareDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 👤 Model: User
  fs.writeFileSync(
    `${modelDir}/userModel.js`,
`import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
});`
  );

  // 🔒 Model: Role
  fs.writeFileSync(
    `${modelDir}/roleModel.js`,
`import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Role = sequelize.define("Role", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
});`
  );

  // 🔑 Model: Permission
  fs.writeFileSync(
    `${modelDir}/permissionModel.js`,
`import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Permission = sequelize.define("Permission", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
});`
  );

  // 🔗 Model: RoleUser
  fs.writeFileSync(
    `${modelDir}/roleUserModel.js`,
`import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Role } from "./roleModel.js";

export const RoleUser = sequelize.define("RoleUser", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false }
});

RoleUser.belongsTo(Role, { foreignKey: "role_id", as: "role" });`
  );

  // 🔗 Model: RolePermission
  fs.writeFileSync(
    `${modelDir}/rolePermissionModel.js`,
`import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Role } from "./roleModel.js";
import { Permission } from "./permissionModel.js";

export const RolePermission = sequelize.define("RolePermission", {
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false }
});

RolePermission.belongsTo(Role, { foreignKey: "role_id" });
RolePermission.belongsTo(Permission, { foreignKey: "permission_id" });`
  );

  // 🔐 Middleware: auth
  fs.writeFileSync(
    `${middlewareDir}/authMiddleware.js`,
`import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido ou expirado" });
  }
}`
  );

  // 🔐 Middleware: role
  fs.writeFileSync(
    `${middlewareDir}/roleMiddleware.js`,
`import { RoleUser } from "../models/roleUserModel.js";
import { RolePermission } from "../models/rolePermissionModel.js";
import { Permission } from "../models/permissionModel.js";

export function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const roleUser = await RoleUser.findOne({ where: { user_id: userId }, include: ["role"] });

      if (!roleUser || roleUser.role.name !== roleName) {
        return res.status(403).json({ error: "Acesso negado: cargo insuficiente" });
      }

      next();
    } catch {
      res.status(500).json({ error: "Erro ao verificar cargo" });
    }
  };
}

export function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const roleUser = await RoleUser.findOne({ where: { user_id: userId }, include: ["role"] });
      if (!roleUser) return res.status(403).json({ error: "Usuário sem cargo" });

      const roleId = roleUser.role.id;

      const permission = await RolePermission.findOne({
        where: { role_id: roleId },
        include: {
          model: Permission,
          where: { name: permissionName }
        }
      });

      if (!permission) return res.status(403).json({ error: "Permissão negada" });

      next();
    } catch {
      res.status(500).json({ error: "Erro ao verificar permissão" });
    }
  };
}`
  );

  // 🔐 Controller: auth
  fs.writeFileSync(
    `${controllerDir}/authController.js`,
`import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ token });
  }
};`
  );

  // 🌐 Rota: /login
  fs.writeFileSync(
    `${routeDir}/authRoute.js`,
`import express from "express";
import { authController } from "../controllers/authController.js";

const router = express.Router();
router.post("/login", authController.login);

export default router;`
  );

  // 🧬 Criação das tabelas e dados iniciais
  const { User } = await import("../src/models/userModel.js");
  const { Role } = await import("../src/models/roleModel.js");
  const { Permission } = await import("../src/models/permissionModel.js");
  const { RoleUser } = await import("../src/models/roleUserModel.js");
  const { RolePermission } = await import("../src/models/rolePermissionModel.js");

  await sequelize.sync();

  const [adminUser] = await User.findOrCreate({
    where: { email: "admin@arkan.dev" },
    defaults: {
      password: await bcrypt.hash("secret", 10)
    }
  });

  const [dashboardRole] = await Role.findOrCreate({ where: { name: "dashboard" } });
  const [managePermission] = await Permission.findOrCreate({ where: { name: "manage_users" } });

  await RoleUser.findOrCreate({
    where: { user_id: adminUser.id, role_id: dashboardRole.id }
  });

  await RolePermission.findOrCreate({
    where: { role_id: dashboardRole.id, permission_id: managePermission.id }
  });

  console.log("✅ Sistema de autenticação RBAC gerado com sucesso.");
  console.log("👤 Usuário: admin@arkan.dev | Senha: secret");
  console.log("🔓 Rota pública disponível: POST /login");
}
