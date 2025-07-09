export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("role_users", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "roles", key: "id" },
      onDelete: "CASCADE"
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE"
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("role_users");
}
