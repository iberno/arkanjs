# 📘 Documentação ArkanJS

ArkanJS é um gerador modular de APIs com Express e Sequelize, focado em segurança, escalabilidade e flexibilidade para aplicações modernas.

---

## 🔧 Estrutura Inicial

- `initProject.js`: comando que cria a base do projeto com diretórios, arquivos e configuração padrão (SQLite)
- Criação de `.env` com JWT secreto dinâmico
- Geração automática do `database/database.sqlite`

### Comando:
```bash
arkan init --install
🧠 CLI - Comandos Disponíveis
🔹 Inicialização
bash
arkan init --install           # Cria estrutura do projeto
arkan init --install --no-docs # Sem rota /doc
🔹 Geração de Recursos
bash
arkan generate:resource produto --fields nome:string,preco:float
arkan generate:resource-auth tarefa --fields titulo:string,feito:boolean
🔹 Autenticação RBAC
bash
arkan generate:auth
Cria modelos: User, Role, Permission, RoleUser, RolePermission

Gera rota /login pública

Cria usuário admin@arkan.dev com senha secret

Associa role dashboard e permissão manage_users

🔹 Configuração de Ambiente
bash
arkan generate:env --sqlite
arkan generate:env --postgresql
arkan generate:env --mysql
arkan generate:env --mongo
arkan generate:env --help
🔐 Proteção de Rotas
Rotas geradas via generate:resource-auth são protegidas por:

authMiddleware: valida token JWT

requireRole("dashboard"): cargo obrigatório

Prontas para expandir com requirePermission()

📂 Estrutura de Pastas
txt
├── src
│   ├── config/          # Conexão Sequelize
│   ├── controllers/     # Lógica dos recursos
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Arquivos de rotas
│   ├── middlewares/     # Autenticação e permissões
│   ├── roles/           # RBAC: Role + associação
│   ├── permissions/     # RBAC: Permission + associação
│   └── server.js        # Ponto inicial da API
├── scripts/             # Scripts CLI
├── templates/           # Arquivos .ejs para geração dinâmica
├── database/            # SQLite local
├── .env                 # Variáveis de ambiente (não versionado)
├── .env.example         # Modelo de ambiente
├── README.md            # Visão geral do projeto
├── Doc.md               # Essa documentação

🔍 Tecnologias Utilizadas
Camada	Tecnologia
Servidor & Rotas	Express.js
ORM	Sequelize
Autenticação	jsonwebtoken
CLI	Commander, Inquirer
Templates	EJS
Configuração .env	dotenv
Utilitários	Módulos nativos (fs, path, crypto)
Formatação Dev	Prettier
Futuro	Swagger, ESLint, Mongoose
✅ Usuário Inicial
Email: admin@arkan.dev

Senha: secret

Cargo: dashboard

Permissão: manage_users

Use essa conta para logar via /login e acessar recursos protegidos.

✨ Conclusão
Este projeto está pronto para crescer com recursos, painéis administrativos, controle de acesso dinâmico e documentação interativa.

Construa, conecte e escale com ArkanJS 🚀