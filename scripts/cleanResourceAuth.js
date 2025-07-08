import fs from "fs";

export function cleanResourceAuth(resourceName) {
  const folders = [
    `src/models/${resourceName}`,
    `src/controllers/${resourceName}`,
    `src/routes/${resourceName}`,
    `src/middlewares/${resourceName}`
  ];

  folders.forEach(folder => {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
      console.log(`🗑️ Removido: ${folder}`);
    } else {
      console.log(`⚠️ Não encontrado: ${folder}`);
    }
  });

  console.log(`✅ Recurso '${resourceName}' com proteção RBAC foi limpo.`);
}
