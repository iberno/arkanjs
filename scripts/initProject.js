import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export function initProject({ noDocs = false } = {}) {
  const dirs = [
    "src",
    "src/config",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/middlewares",
    "src/roles",
    "src/permissions",
    "scripts",
    "templates"
  ];

  // 🔧 Cria estrutura de diretórios
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // 🔐 Arquivo .env
  fs.writeFileSync(".env", `PORT=3000\nJWT_SECRET=seu_segredo_aqui`);

  // 📦 Conexão com banco
  fs.writeFileSync(
    "src/config/db.js",
`import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false
});`
  );

  // 🚀 Server base
  fs.writeFileSync(
    "src/server.js",
`import express from "express";
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
    ${noDocs ? "" : "console.log(`📘 Documentação: http://localhost:${PORT}/doc`);"}
  });
});`
  );

  // 🔁 index.js com rotas dinâmicas
  fs.writeFileSync(
    "src/routes/index.js",
`import express from "express";
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

export default router;`
  );

  // 📘 README simples
  fs.writeFileSync("README.md", `# ArkanJS 🚀\n\nAPI modular com Express + Sequelize.\n`);

  // 📘 Doc.md e rota pública
  if (!noDocs) {
    fs.writeFileSync("Doc.md", `# Documentação ArkanJS\n\nAcesse via /doc`);
    fs.writeFileSync(
      "src/routes/docRoute.js",
`import express from "express";
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

export default router;`
    );
  }

  // 📦 package.json com dependências básicas
  if (!fs.existsSync("package.json")) {
    const pkg = {
      name: "arkanjs",
      type: "module",
      scripts: {
        dev: "nodemon src/server.js"
      },
      dependencies: {
        express: "^4.18.2",
        dotenv: "^16.0.3",
        sequelize: "^6.32.1",
        sqlite3: "^5.1.6",
        marked: "^9.1.6"
      },
      devDependencies: {
        nodemon: "^2.0.22"
      }
    };
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  }

  // 🧪 Instala dependências automaticamente
  try {
    console.log("📦 Instalando dependências...");
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Projeto inicializado com sucesso.");
  } catch (err) {
    console.error("❌ Falha na instalação:", err.message);
  }
}
