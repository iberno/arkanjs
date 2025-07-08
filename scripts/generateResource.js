import fs from "fs";
import path from "path";

export function generateResource(name, fieldsText = "") {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  const modelName = `${capitalized}Model`;
  const controllerName = `${capitalized}Controller`;
  const routeName = `${name}Route`;

  const modelDir = `src/models/${name}`;
  const controllerDir = `src/controllers/${name}`;
  const routeDir = `src/routes/${name}`;

  [modelDir, controllerDir, routeDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const modelPath = `${modelDir}/${name}Model.js`;
  const controllerPath = `${controllerDir}/${name}Controller.js`;
  const routePath = `${routeDir}/${routeName}.js`;

  // ⚠️ Pluralização controlada
  const tableName = name.endsWith("s") ? name : `${name}s`;

  // 🧠 Geração dos campos
  const fieldsArray = fieldsText.split(",").filter(Boolean);
  const fieldLines = fieldsArray.map((field) => {
    const [key, type] = field.split(":");
    return `  ${key}: { type: DataTypes.${type?.toUpperCase() || "STRING"}, allowNull: false }`;
  });

  // 📦 Model
  fs.writeFileSync(
    modelPath,
`import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

// 🧬 Modelo: ${capitalized}
export const ${modelName} = sequelize.define("${name}", {
${fieldLines.length ? fieldLines.join(",\n") : ""}
}, {
  tableName: "${tableName}"
});`
  );

  // 🧠 Controller
  fs.writeFileSync(
    controllerPath,
`import { ${modelName} } from "../../models/${name}/${name}Model.js";

// 🔧 Controller: ${capitalized}
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
      res.status(500).json({ error: "Erro ao buscar ${tableName}", details: err.message });
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

  // 🚦 Rota pública
  fs.writeFileSync(
    routePath,
`import express from "express";
import { ${controllerName} } from "../../controllers/${name}/${name}Controller.js";

const router = express.Router();

router.post("/", ${controllerName}.create);
router.get("/", ${controllerName}.findAll);
router.get("/:id", ${controllerName}.findOne);
router.put("/:id", ${controllerName}.update);
router.delete("/:id", ${controllerName}.remove);

export default router;`
  );

  console.log(`✅ Recurso '${name}' gerado com sucesso em estrutura vertical com tabela '${tableName}'.`);
}
