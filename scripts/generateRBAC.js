import { Role } from "../src/models/auth/roleModel.js";
import { Permission } from "../src/models/auth/permissionModel.js";
import { RolePermission } from "../src/models/auth/rolePermissionModel.js";
import { RoleUser } from "../src/models/auth/roleUserModel.js";

export async function generateRBAC() {
  await Role.sync();
  await Permission.sync();
  await RoleUser.sync();
  await RolePermission.sync();

  console.log("✅ Tabelas RBAC sincronizadas com sucesso.");
}
