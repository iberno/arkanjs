# ArkanJS 🚀

ArkanJS é um gerador de APIs modular com Express + Sequelize, focado em agilidade e boas práticas para projetos Node.js.

## Objetivos principais
- Criar servidores limpos e modulares
- Gerar recursos (CRUD) rapidamente
- Incluir autenticação via JWT com controle por cargo (RBAC)
- Gerar documentação técnica automática

## Estrutura inicial
```bash
cli/
src/
 ├─ config/
 ├─ controllers/
 ├─ models/
 ├─ routes/
 ├─ middlewares/
 ├─ roles/
 ├─ permissions/
scripts/
templates/
.env
package.json

Comandos (serão ativados em breve)
arkan init --install [--no-docs]
arkan generate:resource <nome> --fields
arkan generate:auth
arkan generate:resource-auth <nome> --fields


---

## 🔜 Etapa 2 — Preparar `cli/index.js` e `initProject.js`

Você já tem o `cli/index.js` vazio. Posso te enviar agora os blocos certos pra inicializar o projeto com `arkan init --install`, incluindo a criação automática de arquivos, documentação e dependências.

Me avisa e eu te entrego em seguida o `scripts/initProject.js` já com suporte à flag `--no-docs` e estrutura pronta pra iniciar o servidor.

Estamos no ritmo certo — do zero, limpo e no controle 🎯  
Tamo na batida!