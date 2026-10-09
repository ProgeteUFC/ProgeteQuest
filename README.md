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

