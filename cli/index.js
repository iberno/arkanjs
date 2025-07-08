#!/usr/bin/env node
import { program } from "commander";
import { initProject } from "../scripts/initProject.js";
import { generateResource } from "../scripts/generateResource.js";
import { generateAuth } from "../scripts/generateAuth.js";
import { generateResourceAuth } from "../scripts/generateResourceAuth.js";

// 🎯 Comando: init
program
  .command("new <name>")
  .description("Cria projeto ArkanJS com estrutura pronta para uso")
  .option("--no-docs", "Evita gerar Doc.md e rota /doc")
  .action((name, options) => {
    initProject({ noDocs: options.noDocs, nomeProjeto: name });
  });

// ⚙️ Comando: generate:resource
program
  .command("generate:resource <name>")
  .description("Gera model, controller e rota pública para um recurso")
  .option("--fields <fields>", "Formato: nome:string,ativo:boolean")
  .action((name, options) => {
    generateResource(name, options.fields);
  });

// 🔐 Comando: generate:auth
program
  .command("generate:auth")
  .description("Gera sistema completo de autenticação com JWT e controle por cargo (RBAC)")
  .action(() => {
    generateAuth();
  });

// 🔐 Comando: generate:resource-auth
program
  .command("generate:resource-auth <name>")
  .description("Gera recurso protegido por autenticação JWT + cargo")
  .option("--fields <fields>", "Formato: titulo:string,feito:boolean")
  .action((name, options) => {
    generateResourceAuth(name, options.fields);
  });

program.parse(process.argv);
