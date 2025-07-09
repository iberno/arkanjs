const express = require("express");
const dotenv = require("dotenv");
const { sequelize } = require("./config/db");
const router = require("./routes/index");
require("./models/auth/associations"); // Import associations

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
