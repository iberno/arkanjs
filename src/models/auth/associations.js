const { UserModel } = require("./userModel");
const { RoleModel } = require("./roleModel");
const { PermissionModel } = require("./permissionModel");
const { RoleUserModel } = require("./roleUserModel");
const { RolePermissionModel } = require("./rolePermissionModel");

// User - Role (Many-to-Many)
UserModel.belongsToMany(RoleModel, {
  through: RoleUserModel,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles"
});
RoleModel.belongsToMany(UserModel, {
  through: RoleUserModel,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users"
});

// Role - Permission (Many-to-Many)
RoleModel.belongsToMany(PermissionModel, {
  through: RolePermissionModel,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions"
});
PermissionModel.belongsToMany(RoleModel, {
  through: RolePermissionModel,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles"
});

// Explicit join table associations
RoleUserModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(RoleUserModel, { foreignKey: "user_id" });
RoleUserModel.belongsTo(RoleModel, { foreignKey: "role_id" });
RoleModel.hasMany(RoleUserModel, { foreignKey: "role_id" });

RolePermissionModel.belongsTo(RoleModel, { foreignKey: "role_id" });
RoleModel.hasMany(RolePermissionModel, { foreignKey: "role_id" });
RolePermissionModel.belongsTo(PermissionModel, { foreignKey: "permission_id" });
PermissionModel.hasMany(RolePermissionModel, { foreignKey: "permission_id" });
