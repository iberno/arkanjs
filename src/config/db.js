import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT || "sqlite";
const isSQLite = dialect === "sqlite";

const sequelize = new Sequelize(
  isSQLite
    ? {
        dialect: "sqlite",
        storage: process.env.DB_STORAGE || "database.sqlite",
        logging: false
      }
    : {
        dialect,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false
      }
);

export { sequelize };
