import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Carrega todos os arquivos que terminam com Route.js, exceto o próprio index
const routeFiles = fs.readdirSync(path.resolve("src/routes"))
  .filter(file => file.endsWith("Route.js") && file !== "index.js");

for (const file of routeFiles) {
  const routeName = file.replace("Route.js", "");
  const route = await import(`./${file}`);
  router.use(`/${routeName}`, route.default);
}

export default router;
