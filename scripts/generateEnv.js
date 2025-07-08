import fs from "fs";
import crypto from "crypto";
import { program } from "commander";

const defaultPort = 3000;

program
  .description("Gera arquivos .env e .env.example com base no banco escolhido")
  .option("--sqlite", "Usar SQLite (default)")
  .option("--postgresql", "Usar PostgreSQL")
  .option("--mysql", "Usar MySQL")
  .option("--mongo", "Usar MongoDB (planejado)")
  .parse(process.argv);

const options = program.opts();

// 🔍 Detecta tipo de banco via flags
let dbDialect = "sqlite";
if (options.postgresql) dbDialect = "postgres";
if (options.mysql) dbDialect = "mysql";
if (options.mongo) dbDialect = "mongodb";

// 🔐 Gera segredo JWT
const jwtSecret = crypto.randomBytes(32).toString("hex");

// 🧾 Gera conteúdo do .env
let env = `PORT=${defaultPort}
JWT_SECRET=${jwtSecret}
DB_DIALECT=${dbDialect}
`;

if (dbDialect === "sqlite") {
  env += `DB_STORAGE=database/database.sqlite\n`;
} else if (dbDialect === "postgres") {
  env += `DB_HOST=localhost
DB_PORT=5432
DB_NAME=arkan_db
DB_USER=postgres
DB_PASSWORD=admin\n`;
} else if (dbDialect === "mysql") {
  env += `DB_HOST=localhost
DB_PORT=3306
DB_NAME=arkan_db
DB_USER=root
DB_PASSWORD=admin\n`;
} else if (dbDialect === "mongodb") {
  env += `MONGO_URI=mongodb://localhost:27017/arkan_db\n`;
}

fs.writeFileSync(".env", env);
console.log("✅ Arquivo .env gerado com sucesso.");
console.log(`🔐 JWT gerado: ${jwtSecret.slice(0, 8)}...`);

fs.writeFileSync(".env.example",
`PORT=3000
JWT_SECRET=your_jwt_secret

DB_DIALECT=${dbDialect}
${dbDialect === "sqlite" ? "DB_STORAGE=database/database.sqlite" : dbDialect === "postgres" ? `DB_HOST=localhost\nDB_PORT=5432\nDB_NAME=arkan_db\nDB_USER=your_user\nDB_PASSWORD=your_password` : dbDialect === "mysql" ? `DB_HOST=localhost\nDB_PORT=3306\nDB_NAME=arkan_db\nDB_USER=your_user\nDB_PASSWORD=your_password` : "MONGO_URI=mongodb://localhost:27017/arkan_db"}
`);

console.log("📎 Arquivo .env.example gerado para versionamento.");

if (dbDialect === "sqlite") {
  const dbPath = "database/database.sqlite";
  if (!fs.existsSync("database")) fs.mkdirSync("database");
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "");
  console.log("📂 Banco SQLite criado em: database/database.sqlite");
}
