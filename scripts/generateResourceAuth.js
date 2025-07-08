import fs from "fs";
import path from "path";

export function generateResourceAuth(name, fieldsText = "") {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const modelName = `${capitalized}Model`;
  const controllerName = `${capitalized}Controller`;
  const routeName = `${name}Route`;

  // 🗂️ Pastas verticais por domínio
  const modelDir = `src/models/${name}`;
  const controllerDir = `src/controllers/${name}`;
  const routeDir = `src/routes/${name}`;

  [modelDir, controllerDir, routeDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const modelPath = `${modelDir}/${name}Model.js`;
  const controllerPath = `${controllerDir}/${name}Controller.js`;
  const routePath = `${routeDir}/${routeName}.js`;

  // 🔠 Campos do modelo
  const fieldsArray = fieldsText.split(",").filter(Boolean);
  const fieldLines = fieldsArray.map((field) => {
    const [key, type] = field.split(":");
    return `  ${key}: { type: DataTypes.${type?.toUpperCase() || "STRING"}, allowNull: false },`;
  });

  // 🧱 Model
  fs.writeFileSync(
    modelPath,
`import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const ${modelName} = sequelize.define("${name}", {
${fieldLines.join("\n")}
}, {
  tableName: "${name}s"
});`
  );

  // ⚙️ Controller
  fs.writeFileSync(
    controllerPath,
`import { ${modelName} } from "../../models/${name}/${name}Model.js";

export const ${controllerName} = {
  async create(req, res) {
    try {
      const record = await ${modelName}.create(req.body);
      res.status(201).json(record);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar ${name}", details: err.message });
    }
  },

  async findAll(req, res) {
    try {
      const records = await ${modelName}.findAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar ${name}s", details: err.message });
    }
  },

  async findOne(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar ${name}", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      await record.update(req.body);
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar ${name}", details: err.message });
    }
  },

  async remove(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      await record.destroy();
      res.json({ message: "${capitalized} removido com sucesso" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao remover ${name}", details: err.message });
    }
  }
};`
  );

  // 🔐 Rota protegida por JWT + role "admin"
  fs.writeFileSync(
    routePath,
`import express from "express";
import { ${controllerName} } from "../../controllers/${name}/${name}Controller.js";
import { authMiddleware } from "../../middlewares/auth/authMiddleware.js";
import { requireRole } from "../../middlewares/auth/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), ${controllerName}.create);
router.get("/", authMiddleware, requireRole("admin"), ${controllerName}.findAll);
router.get("/:id", authMiddleware, requireRole("admin"), ${controllerName}.findOne);
router.put("/:id", authMiddleware, requireRole("admin"), ${controllerName}.update);
router.delete("/:id", authMiddleware, requireRole("admin"), ${controllerName}.remove);

export default router;`
  );

  console.log(`🔐 Recurso ${name} com acesso restrito (role: admin) gerado em estrutura vertical com sucesso.`);
}
