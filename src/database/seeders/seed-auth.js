import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  // 👤 Cria usuário admin
  await queryInterface.bulkInsert("users", [{
    email: "admin@arkan.dev",
    password: await bcrypt.hash("secret123", 10),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }]);

  // 🔒 Cria role "admin" (caso não exista)
  await queryInterface.bulkInsert("roles", [{
    name: "admin",
    created_at: new Date(),
    updated_at: new Date()
  }]);

  // 🔑 Cria permissões básicas
  await queryInterface.bulkInsert("permissions", [
    { name: "create_user", created_at: new Date(), updated_at: new Date() },
    { name: "edit_user", created_at: new Date(), updated_at: new Date() }
  ]);

  // 📦 Busca os IDs reais
  const [[adminUser]] = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE email = 'admin@arkan.dev' LIMIT 1`
  );

  const [[adminRole]] = await queryInterface.sequelize.query(
    `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
  );

  const [permissions] = await queryInterface.sequelize.query(
    `SELECT id FROM permissions WHERE name IN ('create_user', 'edit_user')`
  );

  // 🔗 Associa user ↔ role
  await queryInterface.bulkInsert("role_users", [{
    user_id: adminUser.id,
    role_id: adminRole.id,
    created_at: new Date(),
    updated_at: new Date()
  }]);

  // 🔗 Associa role ↔ permissions
  const rolePermissions = permissions.map(p => ({
    role_id: adminRole.id,
    permission_id: p.id,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await queryInterface.bulkInsert("role_permissions", rolePermissions);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("role_permissions", null, {});
  await queryInterface.bulkDelete("role_users", null, {});
  await queryInterface.bulkDelete("permissions", null, {});
  await queryInterface.bulkDelete("roles", { name: "admin" }, {});
  await queryInterface.bulkDelete("users", { email: "admin@arkan.dev" }, {});
}
