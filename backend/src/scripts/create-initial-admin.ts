import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserType } from 'src/Enums/user.enum';

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password: string) {
  if (password.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#\$%\^&\*\(\)_\+\-=`~\[\]{};:'"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

async function run() {
  const name = process.env.INITIAL_ADMIN_NAME;
  const emailRaw = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!name || !emailRaw || !password) {
    console.error(
      'Faltam variáveis obrigatórias: INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD',
    );
    process.exit(1);
  }

  const email = emailRaw.trim().toLowerCase();

  if (!validateEmail(email)) {
    console.error('Formato de e-mail inválido.');
    process.exit(1);
  }

  if (!validatePassword(password)) {
    console.error(
      'Senha fraca. Deve ter no mínimo 8 caracteres, letras maiúsculas/minúsculas, números e símbolos.',
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const adminRepo = queryRunner.manager.getRepository(Admin);

    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      console.log('Já existe um usuário com esse e-mail. Nenhuma alteração realizada.');
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      await app.close();
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      userId: uuidv4(),
      name: name.trim(),
      email,
      password: hashed,
      type: UserType.ADMIN,
    });

    await userRepo.save(user);

    const admin = adminRepo.create({ userId: user.userId, user });
    await adminRepo.save(admin);

    await queryRunner.commitTransaction();

    console.log('Administrador inicial criado com sucesso:', email);
    await queryRunner.release();
    await app.close();
    process.exit(0);
  } catch (err: any) {
    await queryRunner.rollbackTransaction();
    console.error('Erro ao criar administrador inicial:', err?.message ?? err);
    await queryRunner.release();
    await app.close();
    process.exit(1);
  }
}

run();
