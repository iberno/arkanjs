export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("roles", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
  });

  await queryInterface.bulkInsert("roles", [
    {
      name: "admin",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("roles");
}
