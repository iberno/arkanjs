# ⚡ ArkanJS · Modular APIs Generator com RBAC, CLI and Flexible Develpoment.

### ⚡ Arkan is a developer-first CLI tool designed to orchestrate RESTful backends fast — with authentication, RBAC, resource scaffolding, and migration tools ready to go. Built in pure JavaScript with expressive structure and elegant defaults.

---

## 📖 The Origin of the Name

> "Arkan" is a fusion of two inspirations:  
> 🎼 **Charles-Valentin Alkan**, a French composer known for crafting some of the most technically demanding and intricate pieces of solo piano music — a symbol of mastery, depth, and complexity.  
> 🦇 And the **Arkham City** universe from comic lore, evoking a gritty, modular and layered feel — much like backend architecture.

Arkan bridges art and engineering — expressing APIs with finesse and function, like a digital symphony performed in terminal.

---

## 🚀 Resources

- Authentication with JWT
- Access control via roles and permissions (RBAC)
- Integrated CLI (generate:auth, generate:resource, generate:env)
- Dynamic .env environment with random JWT_SECRET
- Full support for SQLite, PostgreSQL, MySQL, and MongoDB
- EJS templates for automatic code generation
- Markdown documentation served through the browser (/doc)
- Modular and ready to scale

---

## 📦 Installation

```bash
git clone https://github.com/SEU_USUARIO/arkanjs-api
cd arkanjs-api
npm install
npm run init
🔧 Development Kit
bash
npm run generate:env --sqlite
npm run generate:env --postgresql
Isso cria .env com segredo JWT e configurações de banco.

🔐 Auth Generator RBAC
bash
npm run generate:auth
Cria automaticamente:

Usuário: admin@arkan.dev
Senha: secret
Cargo: dashboard
Permissão: manage_users
Rota pública: POST /login

✨ Create Resources
bash
npm run generate:resource produto --fields nome:string,preco:float
npm run generate:resource-auth tarefa --fields titulo:string,feito:boolean
Gera models, controllers, rotas e protege acesso com base no cargo do usuário.

📄 Interative Documentation
Acesse no navegador:

http://localhost:3000/doc
View the contents of Doc.md with HTML rendering by marked.

🧰 Technologies Used
Camada	Tecnologia
Servidor	Express.js
ORM	Sequelize
Autenticação	JWT + Bcrypt
CLI	Commander, Inquirer (planejado)
Templates	EJS
Ambiente	dotenv
Markdown Viewer	marked

📝 License
MIT © 2025 - Iberno Hoffmann

ArkanJS was born from the idea that generating code isn’t enough. You need to generate structure, security, and meaning. If you enjoy elegant and flexible backend development, this is your foundation. Built with 💙, Classical Music, and architecture.

