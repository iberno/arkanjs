// scripts/reverseModels.js
import SequelizeAuto from "sequelize-auto";
import { sequelize } from "../src/config/db.js";

export function reverseModels() {
  const auto = new SequelizeAuto(sequelize, null, null, {
    directory: "./src/models", // saída dos arquivos
    additional: {
      timestamps: false
    },
    lang: "esm", // export ESModules
  });

  auto.run((err) => {
    if (err) throw err;
    console.log("✅ Modelos gerados com sucesso via engenharia reversa!");
  });
}
