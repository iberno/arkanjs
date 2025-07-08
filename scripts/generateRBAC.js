import { Role } from "../src/roles/Role.js";
import { Permission } from "../src/permissions/Permission.js";
import { RolePermission } from "../src/permissions/RolePermission.js";
import { RoleUser } from "../src/roles/RoleUser.js";

export async function generateRBAC() {
  await Role.sync();
  await Permission.sync();
  await RoleUser.sync();
  await RolePermission.sync();

  console.log("✅ Tabelas RBAC criadas com sucesso.");
}
