# ProgeteQuest

## Executando o projeto

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Crie um arquivo `backend/.env` com base nas variáveis necessárias para o ambiente:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<usuario>
DB_PASSWORD=<senha>
DB_DATABASE=progetequest

JWT_SECRET=<chave_jwt>
PORT=3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Pesquisa administrativa de usuários

A tela `/admin/users` usa a API real com filtros e paginação no backend:
`GET /admin/users?type=teacher&status=active&search=maria&page=1&limit=10`.
A resposta contém `data` e `meta` (`page`, `limit`, `totalItems`, `totalPages`);
o campo `registration` representa matrícula ou SIAPE, conforme o perfil.
O cadastro, a edição, a visualização, a ativação/desativação e a consulta de
impacto compartilham o `AdminController`. O dashboard permanece em
`GET /admin/dashboard`. Todas essas rotas exigem um administrador ativo.

