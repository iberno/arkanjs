const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 🔎 Função recursiva para encontrar rotas
function findRouteFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (entry.name.endsWith("Route.js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const routeFiles = findRouteFiles(path.resolve("src/routes"));

for (const filePath of routeFiles) {
  const routeName = path.basename(filePath, "Route.js");
  // Remove the .js extension for require
  const route = require(filePath.replace(/\.js$/, ''));
  router.use(`/${routeName}`, route.default || route); // Handle both default and non-default exports
}

module.exports = router;
