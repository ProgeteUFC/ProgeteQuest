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

Crie um arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Por padrão:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Documentação da API

Com o backend em execução, o Swagger está disponível em:

- `http://localhost:3000/api`
- `http://localhost:3000/api-json`
