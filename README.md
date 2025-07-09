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
npm install @ibernoh/arkanjs
```

## 🚀 Uso

Após a instalação, você pode usar o ArkanJS CLI para gerar a estrutura inicial do seu projeto.

### Inicialização

Para iniciar um novo projeto, execute os seguintes comandos:

```bash
npx arkanjs generate:env
npx arkanjs generate:auth
```

O comando `generate:env` cria o arquivo `.env` com as variáveis de ambiente necessárias, e o `generate:auth` cria toda a estrutura de autenticação e RBAC.

### Geradores disponíveis


🔒 `generate:auth`

Cria automaticamente:

- Models: User, Role, Permission, role_users, role_permissions
- Middlewares: autenticação e proteção RBAC
- Rota pública: POST /auth/login
- Usuário inicial: admin@arkan.dev com cargo admin e permissão manage_users


✨ `generate:resource-auth`

```bash
npx arkanjs generate:resource-auth tarefa --fields titulo:string,feito:boolean
```

Gera estrutura completa para recurso protegido por RBAC:

- CRUD vertical com controller, model e rota
- Proteção por cargo "admin" e permissões automáticas (create_tarefa, read_tarefa, etc.)


🧱 Banco e Migrations

Para rodar as migrations e seeds, utilize os comandos:

```bash
npx arkanjs migrate
npx arkanjs seed
```

O seed inicial garante que o sistema tenha:

- Um usuário ativo
- A role "admin" pré-criada
- Permissões básicas
- Relacionamentos configurados

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

## ⚙️ Referência de Comandos CLI

### `arkanjs new <name>`

📦 Cria um novo projeto ArkanJS.

**Opções:**
- `--no-docs`: Pula a criação do arquivo `Doc.md` e da rota `/doc`.

**Exemplo:**
```bash
arkanjs new my-new-project --no-docs
```

### `arkanjs make:resource <name>`

📄 Gera um recurso público (model, controller e rota).

**Opções:**
- `--fields <fields>`: Define os campos do modelo no formato `nome:tipo,outroNome:outroTipo`.

**Exemplo:**
```bash
arkanjs make:resource product --fields name:string,price:float,inStock:boolean
```

### `arkanjs make:resource-auth <name>`

🔐 Gera um recurso protegido por JWT e controle de acesso baseado em papéis (RBAC).

**Opções:**
- `--fields <fields>`: Define os campos do modelo no formato `titulo:string,feito:boolean`.

**Exemplo:**
```bash
arkanjs make:resource-auth task --fields title:string,completed:boolean
```

### `arkanjs make:auth`

🛡️ Gera um sistema completo de autenticação JWT com RBAC.

**Exemplo:**
```bash
arkanjs make:auth
```

### `arkanjs clean:auth`

🧨 Remove todos os arquivos e pastas relacionados ao sistema de autenticação.

**Exemplo:**
```bash
arkanjs clean:auth
```

### `arkanjs clean:resource-auth <name>`

🧼 Remove os arquivos e pastas de um recurso protegido.

**Exemplo:**
```bash
arkanjs clean:resource-auth task
```

### `arkanjs make:migration <name>`

📦 Cria um novo arquivo de migração para o banco de dados.

**Exemplo:**
```bash
arkanjs make:migration add_users_table
```

### `arkanjs make:seed <name>`

🌱 Cria um novo arquivo de seed para o banco de dados.

**Exemplo:**
```bash
arkanjs make:seed initial_admin_user
```

### `arkanjs migrate`

🧱 Executa todas as migrações pendentes no banco de dados.

**Exemplo:**
```bash
arkanjs migrate
```

### `arkanjs seed`

🌿 Executa todos os arquivos de seed no banco de dados.

**Exemplo:**
```bash
arkanjs seed
```

### `arkanjs reverse`

📥 Realiza engenharia reversa de modelos a partir de um banco de dados existente.

**Exemplo:**
```bash
arkanjs reverse
```

### `arkanjs list`

📂 Lista todos os recursos gerados no projeto.

**Exemplo:**
```bash
arkanjs list
```
