import fs from "fs";
import path from "path";

export function generateResourceAuth(name, fieldsText = "") {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const modelName = `${capitalized}Model`;
  const controllerName = `${capitalized}Controller`;
  const routeName = `${name}Route`;

  const modelPath = `src/models/${name}Model.js`;
  const controllerPath = `src/controllers/${name}Controller.js`;
  const routePath = `src/routes/${routeName}.js`;

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
import { sequelize } from "../config/db.js";

export const ${modelName} = sequelize.define("${name}", {
${fieldLines.join("\n")}
}, {
  tableName: "${name}s"
});`
  );

  // ⚙️ Controller
  fs.writeFileSync(
    controllerPath,
    `import { ${modelName} } from "../models/${name}Model.js";

export const ${controllerName} = {
  async create(req, res) {
    try {
      const record = await ${modelName}.create(req.body);
      res.status(201).json(record);
    } catch {
      res.status(500).json({ error: "Erro ao criar ${name}" });
    }
  },

  async findAll(req, res) {
    try {
      const records = await ${modelName}.findAll();
      res.json(records);
    } catch {
      res.status(500).json({ error: "Erro ao buscar ${name}s" });
    }
  },

  async findOne(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      res.json(record);
    } catch {
      res.status(500).json({ error: "Erro ao buscar ${name}" });
    }
  },

  async update(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      await record.update(req.body);
      res.json(record);
    } catch {
      res.status(500).json({ error: "Erro ao atualizar ${name}" });
    }
  },

  async remove(req, res) {
    try {
      const record = await ${modelName}.findByPk(req.params.id);
      if (!record) return res.status(404).json({ error: "${capitalized} não encontrado" });
      await record.destroy();
      res.json({ message: "${capitalized} removido com sucesso" });
    } catch {
      res.status(500).json({ error: "Erro ao remover ${name}" });
    }
  }
};`
  );

  // 🔐 Rota protegida por JWT + role "dashboard"
  fs.writeFileSync(
    routePath,
    `import express from "express";
import { ${controllerName} } from "../controllers/${name}Controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("dashboard"), ${controllerName}.create);
router.get("/", authMiddleware, requireRole("dashboard"), ${controllerName}.findAll);
router.get("/:id", authMiddleware, requireRole("dashboard"), ${controllerName}.findOne);
router.put("/:id", authMiddleware, requireRole("dashboard"), ${controllerName}.update);
router.delete("/:id", authMiddleware, requireRole("dashboard"), ${controllerName}.remove);

export default router;`
  );

  console.log(`🔐 Recurso ${name} com acesso restrito (role: dashboard) gerado com sucesso.`);
}
