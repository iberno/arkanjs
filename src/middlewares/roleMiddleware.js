import { RoleUser } from "../roles/RoleUser.js";
import { RolePermission } from "../permissions/RolePermission.js";
import { Permission } from "../permissions/Permission.js";

export function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const role = await RoleUser.findOne({ where: { user_id: userId }, include: ["role"] });

      if (!role || role.role.name !== roleName) {
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
      if (!roleUser) return res.status(403).json({ error: "Usuário sem cargo associado" });

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
}
