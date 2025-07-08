import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/", router); // Rotas dinâmicas

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`📘 Documentação: http://localhost:${PORT}/doc`);
  });
});
