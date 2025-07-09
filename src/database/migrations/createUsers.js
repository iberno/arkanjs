export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
