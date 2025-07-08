import fs from "fs";

export function cleanAuth() {
  const folders = [
    "src/models/auth",
    "src/controllers/auth",
    "src/middlewares/auth",
    "src/routes/auth"
  ];

  folders.forEach(folder => {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
      console.log(`🧨 Removido: ${folder}`);
    } else {
      console.log(`⚠️ Não encontrado: ${folder}`);
    }
  });

  console.log("✅ Autenticação RBAC apagada com sucesso.");
}
