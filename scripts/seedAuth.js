import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "../src/config/db.js";
import { UserModel } from "../src/models/auth/userModel.js";
import { RoleModel } from "../src/models/auth/roleModel.js";
import { PermissionModel } from "../src/models/auth/permissionModel.js";
import { RoleUserModel } from "../src/models/auth/roleUserModel.js";
import { RolePermissionModel } from "../src/models/auth/rolePermissionModel.js";

(async () => {
  try {
    await sequelize.sync();

    // 👤 Cria usuário admin
    const [adminUser] = await UserModel.findOrCreate({
      where: { email: "admin@arkan.dev" },
      defaults: {
        password: await bcrypt.hash("secret", 10),
        is_active: true
      }
    });

    // 🔒 Cria role "dashboard"
    const [dashboardRole] = await RoleModel.findOrCreate({
      where: { name: "dashboard" }
    });

    // 🔑 Cria permissão "manage_users"
    const [managePermission] = await PermissionModel.findOrCreate({
      where: { name: "manage_users" }
    });

    // 🔗 Associa user ↔ role
    await RoleUserModel.findOrCreate({
      where: {
        user_id: adminUser.id,
        role_id: dashboardRole.id
      }
    });

    // 🔗 Associa role ↔ permission
    await RolePermissionModel.findOrCreate({
      where: {
        role_id: dashboardRole.id,
        permission_id: managePermission.id
      }
    });

    console.log("\n🌱 SeedAuth aplicado com sucesso.");
    console.log("👤 Usuário: admin@arkan.dev | Senha: secret");
    console.log("🔒 Role: dashboard | Permissão: manage_users\n");
  } catch (err) {
    console.error("❌ Erro ao aplicar seedAuth:", err);
  } finally {
    await sequelize.close();
  }
})();
