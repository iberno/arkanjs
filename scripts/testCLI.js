import { generateAuth } from "./generateAuth.js";
import { generateResourceAuth } from "./generateResourceAuth.js";

console.log("📦 Simulação do CLI ArkanJS");
console.log("🔧 Diretório atual:", process.cwd());

(async () => {
  await generateAuth(); // Simula CLI: arkanjs generate:auth
  generateResourceAuth("tarefa", "titulo:string,feito:boolean"); // Simula arkanjs generate:resource-auth tarefa
})();
