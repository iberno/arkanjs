import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT || "sqlite";

export default {
  development: {
    dialect,
    storage: process.env.DB_STORAGE || "database.sqlite",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  },
  production: {
    dialect,
    storage: process.env.DB_STORAGE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false
  }
};
