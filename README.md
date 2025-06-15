# ProgeteQuest

## Passo a passo para rodar o projeto

### 1. Instalar dependências

Abra o terminal na raiz do projeto e execute os comandos abaixo:

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### 2. Configurar variáveis de ambiente do backend

Crie um arquivo .env dentro da pasta backend com o seguinte conteúdo (ajuste os valores conforme seu ambiente):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=progetequest

JWT_SECRET=chave_secreta

PORT=3000
```

### 3. Rodar o backend

No terminal dentro da pasta backend:

```sh
npm run start:dev
```

### 4. Rodar o frontend

No terminal dentro da pasta frontend:

```sh
npm run dev
```

O backend estará disponível em http://localhost:3000 e o frontend em http://localhost:5173 (ou a porta exibida no terminal).
