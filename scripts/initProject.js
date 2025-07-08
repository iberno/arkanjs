import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

export function initProject({ noDocs = false, nomeProjeto = "arkanjs_api" } = {}) {
  // 🗂 Define e cria o diretório raiz do projeto
  const targetDir = path.resolve(process.cwd(), nomeProjeto);

  if (fs.existsSync(targetDir)) {
    console.log(`❌ Diretório "${nomeProjeto}" já existe. Escolha outro nome ou remova.`);
    return;
  }

  fs.mkdirSync(targetDir);
  process.chdir(targetDir); // 📍 Muda o contexto de trabalho

  // 🧱 Agora sim: cria estrutura dentro da nova pasta
  const dirs = [
    "src",
    "src/config",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/middlewares",
    "src/roles",
    "src/permissions"
  ];

  dirs.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });


  // 🔐 .env com configuração
  const jwtSecret = crypto.randomBytes(32).toString("hex");
  const envContent = `# 🔧 API Settings
PORT=3000
JWT_SECRET=${jwtSecret}

# 🗄️ Database Settings
DB_DIALECT=sqlite
DB_STORAGE=database.sqlite

DB_HOST=localhost
DB_PORT=5432
DB_NAME=arkan_db
DB_USER=root
DB_PASSWORD=admin
`;
  fs.writeFileSync(".env", envContent);
  console.log("✅ .env gerado com sucesso");
  console.log(`🔐 JWT secreto: ${jwtSecret.slice(0, 8)}...`);

  // 📦 Conexão com banco
  fs.writeFileSync("src/config/db.js", `import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "sqlite",
  storage: process.env.DB_STORAGE || "database.sqlite",
  logging: false
});
`);

  // 🚀 Server base
  fs.writeFileSync("src/server.js", `import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(\`🚀 Servidor rodando: http://localhost:\${PORT}\`);
    ${noDocs ? "" : "console.log(`📘 Doc: http://localhost:${PORT}/doc`);"}
  });
});
`);

  // 🔁 Roteador principal
  fs.writeFileSync("src/routes/index.js", `import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const routeFiles = fs.readdirSync(path.resolve("src/routes"))
  .filter(f => f.endsWith("Route.js") && f !== "index.js");

for (const file of routeFiles) {
  const routeName = file.replace("Route.js", "");
  const route = await import(\`./\${file}\`);
  router.use(\`/\${routeName}\`, route.default);
}

export default router;
`);

  // 📘 Doc embutida
  if (!noDocs) {
    fs.writeFileSync("Doc.md", `# Documentação ArkanJS\n\nRota pública: /doc`);
    fs.writeFileSync("src/routes/docRoute.js", `import express from "express";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const router = express.Router();
router.get("/", (req, res) => {
  try {
    const md = fs.readFileSync(path.resolve("Doc.md"), "utf-8");
    res.send(marked.parse(md));
  } catch {
    res.status(500).send("❌ Doc.md não encontrado");
  }
});
export default router;
`);
  }

  // 📦 package.json autônomo
  if (!fs.existsSync("package.json")) {
    const pkg = {
      name: nomeProjeto,
      type: "module",
      scripts: {
        dev: "nodemon src/server.js",
        start: "node src/server.js"
      },
      dependencies: {
        express: "^4.18.2",
        dotenv: "^16.3.1",
        sequelize: "^6.35.1",
        sqlite3: "^5.1.7",
        marked: "^9.1.4"
      },
      devDependencies: {
        nodemon: "^3.1.0"
      }
    };
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  }

  // 📂 README básico
  fs.writeFileSync("README.md", `# ${nomeProjeto}\n\nAPI gerada pelo ArkanJS — Express + Sequelize pronta pra rodar!`);

  // 📦 Instala dependências
  try {
    console.log("📦 Instalando dependências...");
    execSync("npm install", { stdio: "inherit" });
    console.log("\n🎉 Projeto criado com sucesso!");
    console.log("💡 Use: npm run dev");
    console.log("📘 Documentação: http://localhost:3000/doc\n");
  } catch (err) {
    console.error("❌ Falha na instalação:", err.message);
  }
}
