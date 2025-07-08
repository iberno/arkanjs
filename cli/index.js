#!/usr/bin/env node
import { program } from "commander";
import { initProject } from "../scripts/initProject.js";
import { generateAuth } from "../scripts/generateAuth.js";
import { generateResource } from "../scripts/generateResource.js";
import { generateResourceAuth } from "../scripts/generateResourceAuth.js";
import { cleanAuth } from "../scripts/cleanAuth.js";
import { cleanResourceAuth } from "../scripts/cleanResourceAuth.js";
import { execSync } from "child_process";
import { reverseModels } from "../scripts/reverseModels.js";
import fs from "fs";
import path from "path";

program
  .name("arkanjs")
  .description("🔥 ArkanJS CLI — vertical framework with JWT and RBAC")
  .version("1.0.0");

//
// 🎯 Initialization
//
program
  .command("new <name>")
  .description("📦 Create a new ArkanJS project")
  .option("--no-docs", "Skip Doc.md and /doc route")
  .action((name, options) => {
    initProject({ noDocs: options.noDocs, nomeProjeto: name });
  });

//
// 🚀 Resource Generation
//
program
  .command("make:resource <name>")
  .description("📄 Generate public resource (model, controller and route)")
  .option("--fields <fields>", "Format: name:string,isActive:boolean")
  .action((name, options) => {
    generateResource(name, options.fields);
  });

program
  .command("make:resource-auth <name>")
  .description("🔐 Generate protected resource with JWT + role")
  .option("--fields <fields>", "Format: title:string,done:boolean")
  .action((name, options) => {
    generateResourceAuth(name, options.fields);
  });

//
// 🔐 Auth System
//
program
  .command("make:auth")
  .description("🛡️ Generate full JWT authentication system with RBAC")
  .action(() => {
    generateAuth();
  });

//
// 🧹 Clean Commands
//
program
  .command("clean:auth")
  .description("🧨 Remove all authentication files and folders")
  .action(() => {
    cleanAuth();
  });

program
  .command("clean:resource-auth <name>")
  .description("🧼 Remove protected resource files and folders")
  .action((name) => {
    cleanResourceAuth(name);
  });

//
// 🧱 Database Commands
//
program
  .command("make:migration <name>")
  .description("📦 Create a new migration file")
  .action((name) => {
    execSync(`npx sequelize-cli migration:generate --name ${name}`, { stdio: "inherit" });
  });

program
  .command("make:seed <name>")
  .description("🌱 Create a new seed file")
  .action((name) => {
    execSync(`npx sequelize-cli seed:generate --name ${name}`, { stdio: "inherit" });
  });

program
  .command("migrate")
  .description("🧱 Run all pending database migrations")
  .action(() => {
    execSync(`npx sequelize-cli db:migrate`, { stdio: "inherit" });
  });

program
  .command("seed")
  .description("🌿 Run all seed files")
  .action(() => {
    execSync(`npx sequelize-cli db:seed:all`, { stdio: "inherit" });
  });

program
  .command("reverse")
  .description("📥 Reverse-engineer models from existing database")
  .action(() => {
    reverseModels();
  });

//
// 🔍 Dynamic List
//
program
  .command("list")
  .description("📂 List all generated resources")
  .action(() => {
    const modelsPath = path.resolve("src/models");
    if (!fs.existsSync(modelsPath)) return console.log("⚠️ No resources found.");

    const folders = fs.readdirSync(modelsPath).filter(folder => {
      return folder !== "auth" && fs.statSync(path.join(modelsPath, folder)).isDirectory();
    });

    if (!folders.length) {
      console.log("📁 No resources created yet.");
    } else {
      console.log("📚 Existing resources:");
      folders.forEach(name => console.log("  • " + name));
    }
  });

program.parse(process.argv);
