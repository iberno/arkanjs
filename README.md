ArkanJS — Modular APIs Generator com RBAC
markdown
# ⚡ ArkanJS · Modular API Generator com RBAC, CLI e Desenvolvimento Vertical

ArkanJS é uma ferramenta de linha de comando (CLI) voltada para desenvolvedores que desejam construir backends expressivos e seguros com rapidez. Oferece suporte completo para autenticação com JWT, controle de acesso via papéis e permissões (RBAC), geração automatizada de recursos e documentação interativa.

---

## 🔐 Autenticação com RBAC

O sistema de autenticação do ArkanJS utiliza JWT combinado com RBAC (Role-Based Access Control), permitindo que usuários possuam múltiplos cargos e que cada cargo tenha permissões específicas atribuídas.

### Estrutura relacional

- `users` — usuários com campos como email, senha, is_active
- `roles` — cargos: admin, editor, viewer...
- `permissions` — ações como `create_user`, `edit_task`, etc.
- `role_users` — ponte entre usuários e cargos (N:N)
- `role_permissions` — ponte entre cargos e permissões (N:N)

### Middlewares disponíveis

- `authMiddleware` — valida token JWT
- `requireRole("admin")` — exige cargo específico
- `requirePermission("edit_user")` — exige permissão específica

---

## 📦 Instalação

```bash
git clone https://github.com/iberno/arkanjs
cd arkanjs
npm install
npm run init
⚙️ Geradores disponíveis
🔒 generate:auth
bash
npm run generate:auth
Cria automaticamente:

Models: User, Role, Permission, role_users, role_permissions

Middlewares: autenticação e proteção RBAC

Rota pública: POST /auth/login

Usuário inicial: admin@arkan.dev com cargo admin e permissão manage_users

✨ generate:resource-auth
bash
npm run generate:resource-auth tarefa --fields titulo:string,feito:boolean
Gera estrutura completa para recurso protegido por RBAC:

CRUD vertical com controller, model e rota

Proteção por cargo "admin" e permissões automáticas (create_tarefa, read_tarefa, etc.)

🧱 Banco e Migrations
Rodar migrations e seeds
bash
arkanjs migrate
arkanjs seed
O seed inicial garante que o sistema tenha:

Um usuário ativo

A role "admin" pré-criada

Permissões básicas

Relacionamentos configurados

🗂️ Estrutura de diretórios
src/
  models/
    auth/         → estrutura de autenticação + RBAC
    tarefa/       → exemplo de recurso protegido
  controllers/
  middlewares/
  routes/
🔑 Uso básico da API
Login
http
POST /auth/login
Body: {
  "email": "admin@arkan.dev",
  "password": "secret123"
}
Rota protegida
http
GET /tarefa/
Headers:
  Authorization: Bearer <token>
→ Protegida por cargo "admin" e permissão "read_tarefa"
📝 Documentação interativa
bash
http://localhost:3000/doc
Serve o conteúdo Markdown do arquivo Doc.md renderizado em HTML para consulta via navegador.

💙 Filosofia do ArkanJS
"Mais que gerar código, o ArkanJS cria estrutura, segurança e significado."

Com base modular, fluxo vertical e RBAC embutido, o ArkanJS nasceu pra escalar — seja pra criar um MVP rápido ou um painel administrativo completo.

🔧 Tecnologias
Camada	Tecnologia
Servidor	Express.js
ORM	Sequelize
Autenticação	JWT + Bcrypt
CLI Generator	Commander
Templates	EJS
Ambiente	dotenv
Documentação	marked
📝 Licença
MIT © 2025 — Iberno Hoffmann ArkanJS nasceu da ideia de que backends merecem elegância. Construído com 💙, música clássica e arquitetura digital.