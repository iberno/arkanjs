import express from "express";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const router = express.Router();

router.get("/", (req, res) => {
  const docPath = path.resolve("Doc.md");
  if (!fs.existsSync(docPath)) {
    return res.status(404).send("📁 Documentação não encontrada.");
  }

  const markdown = fs.readFileSync(docPath, "utf-8");
  const html = marked.parse(markdown);

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ArkanJS — Documentação</title>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: auto; }
        pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; }
        code { font-family: monospace; }
        h1, h2, h3 { color: #4B4B4B; }
        a { color: #007acc; text-decoration: none; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);
});

export default router;
