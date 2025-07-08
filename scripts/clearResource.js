import fs from "fs";
import path from "path";

export function cleanResource(resourceName) {
  const folders = [
    `src/models/${resourceName}`,
    `src/controllers/${resourceName}`,
    `src/routes/${resourceName}`
  ];

  folders.forEach(folder => {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
      console.log(`🗑️ Pasta removida: ${folder}`);
    } else {
      console.log(`⚠️ Pasta não encontrada: ${folder}`);
    }
  });

  console.log(`✅ Recurso '${resourceName}' apagado com sucesso.`);
}
