// Este arquivo existe exclusivamente para o TypeORM CLI (migration:generate / migration:run).
// Ele não é usado pela aplicação NestJS em runtime e apenas fornece uma configuração mínima
// de DataSource para que o CLI consiga se conectar ao banco.
import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.{ts,js}'],
});
