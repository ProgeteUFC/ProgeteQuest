import {
  BadRequestException,
  ConflictException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import request = require('supertest');
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { AdminController } from '../admin/admin.controller';
import { AdminService } from '../admin/admin.service';
import { AdminDashboardService } from '../admin/admin-dashboard.service';
import { TeacherTransferService } from '../admin/teacher-transfer.service';
import { RolesGuard } from '../guards/roles.guard';
import { UserStatus, UserType } from '../Enums/user.enum';

describe('Edição administrativa transacional', () => {
  let service: UserService;
  let manager: { findOne: jest.Mock; save: jest.Mock; query: jest.Mock };
  let transaction: jest.Mock;
  let user: User;

  beforeEach(() => {
    user = {
      userId: 'target',
      name: 'Aluno',
      email: 'aluno@exemplo.com',
      password: 'hash-antigo',
      type: UserType.STUDENT,
      status: UserStatus.ACTIVE,
    } as User;
    manager = {
      findOne: jest.fn(async (entity, options) => {
        if (entity === User && options.where.userId === 'target')
          return { ...user };
        if (entity === Student && options.where.userId === 'target')
          return { userId: 'target', registrationStudent: '123456' };
        return null;
      }),
      save: jest.fn(async (_, value) => value),
      query: jest.fn(async () => []),
    };
    transaction = jest.fn(async (work) => work(manager));
    service = new UserService(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      { transaction } as never,
    );
  });

  it('normaliza dados, usa apenas o manager da transação e não retorna senha', async () => {
    const result = await service.update('target', {
      name: ' Novo nome ',
      email: ' NOVO@EXEMPLO.COM ',
      registrationStudent: '654321',
    });
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(manager.query).toHaveBeenCalledWith(
      expect.stringContaining('pg_advisory_xact_lock'),
      ['registration:654321'],
    );
    expect(manager.save).toHaveBeenCalledWith(
      Student,
      expect.objectContaining({ registrationStudent: '654321' }),
    );
    expect(manager.save).toHaveBeenCalledWith(
      User,
      expect.objectContaining({ name: 'Novo nome', email: 'novo@exemplo.com' }),
    );
    expect(result).not.toHaveProperty('password');
  });

  it('gera hash bcrypt e mantém a senha exata, incluindo espaços', async () => {
    await service.update('target', { password: ' NovaSenha123! ' });
    const saved = manager.save.mock.calls.find(
      ([entity]) => entity === User,
    )![1];
    expect(saved.password).not.toBe(' NovaSenha123! ');
    expect(await bcrypt.compare(' NovaSenha123! ', saved.password)).toBe(true);
  });

  it('não altera a senha quando ela é omitida', async () => {
    await service.update('target', { name: 'Outro nome' });
    expect(manager.save).toHaveBeenCalledWith(
      User,
      expect.objectContaining({ password: 'hash-antigo' }),
    );
  });

  it('rejeita e-mail duplicado antes de gravar', async () => {
    manager.findOne.mockImplementation(async (entity, options) =>
      entity === User
        ? options.where.email
          ? { userId: 'other' }
          : { ...user }
        : null,
    );
    await expect(
      service.update('target', { email: 'outro@exemplo.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('rejeita matrícula já usada por professor, sem salvar parcialmente o nome', async () => {
    manager.findOne.mockImplementation(async (entity) =>
      entity === Teacher ? { userId: 'other' } : null,
    );
    await expect(
      service.update('target', {
        name: 'Não salvar',
        registrationStudent: '654321',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('rejeita SIAPE para aluno e mudança de perfil', async () => {
    await expect(
      service.update('target', { registrationTeacher: '654321' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      service.update('target', { type: 'teacher' } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('rejeita corpo vazio e dados em branco', async () => {
    await expect(service.update('target', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.update('target', { name: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('propaga falha de persistência para a transação desfazer a operação', async () => {
    manager.save.mockRejectedValue(new Error('falha de persistência'));
    await expect(
      service.update('target', { name: 'Novo', registrationStudent: '654321' }),
    ).rejects.toThrow('falha de persistência');
    expect(manager.save).toHaveBeenCalledTimes(1);
  });

  it('traduz conflito de unicidade concorrente em 409', async () => {
    manager.save.mockRejectedValue({ driverError: { code: '23505' } });
    await expect(
      service.update('target', { email: 'outro@exemplo.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

describe('Rotas administrativas: autorização e validação HTTP', () => {
  let app: INestApplication;
  const id = '550e8400-e29b-41d4-a716-446655440000';
  const adminService = { findUsers: jest.fn() };
  const dashboardService = { getDashboard: jest.fn() };
  const teacherTransferService = { transferClasses: jest.fn() };
  const service = {
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneForAdmin: jest.fn(),
    getDeletionImpact: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: UserService, useValue: service },
        { provide: AdminService, useValue: adminService },
        { provide: AdminDashboardService, useValue: dashboardService },
        { provide: TeacherTransferService, useValue: teacherTransferService },
      ],
    }).compile();
    const jwt = {
      verifyAsync: jest.fn(async (token) => ({ user: { userId: token } })),
    };
    const repository = {
      findOne: jest.fn(async ({ where }) => ({
        userId: where.userId,
        type: where.userId === 'inactive' ? 'admin' : where.userId,
        status: where.userId === 'inactive' ? 'inactive' : 'active',
        admins: [],
      })),
    };
    app = module.createNestApplication();
    app.useGlobalGuards(
      new RolesGuard(
        new Reflector(),
        jwt as unknown as JwtService,
        repository as never,
      ),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    service.update.mockResolvedValue({ userId: id });
  });
  afterAll(async () => {
    await app.close();
  });

  it('preserva a listagem paginada e transforma os filtros de consulta', async () => {
    const result = { data: [], meta: { page: 2, limit: 10, totalItems: 0, totalPages: 0 } };
    adminService.findUsers.mockResolvedValue(result);
    await request(app.getHttpServer())
      .get('/admin/users?type=teacher&status=active&search=maria&page=2&limit=10')
      .set('Authorization', 'Bearer admin')
      .expect(200, result);
    expect(adminService.findUsers).toHaveBeenCalledWith(expect.objectContaining({
      type: 'teacher', status: 'active', search: 'maria', page: 2, limit: 10,
    }));
  });

  it.each(['page=0', 'limit=101', 'type=invalid', 'status=invalid', 'unknown=value'])(
    'rejeita consulta inválida %s', async (query) => {
      await request(app.getHttpServer()).get(`/admin/users?${query}`)
        .set('Authorization', 'Bearer admin').expect(400);
      expect(adminService.findUsers).not.toHaveBeenCalled();
    },
  );

  it('preserva a rota de dashboard fora de /admin/users', async () => {
    dashboardService.getDashboard.mockResolvedValue({ totalClasses: 3 });
    await request(app.getHttpServer()).get('/admin/dashboard')
      .set('Authorization', 'Bearer admin').expect(200, { totalClasses: 3 });
  });

  it('preserva consulta de detalhes e impacto no controller administrativo', async () => {
    service.findOneForAdmin.mockResolvedValue({ userId: id, name: 'Maria' });
    service.getDeletionImpact.mockResolvedValue({ userId: id, checkins: 2 });
    await request(app.getHttpServer()).get(`/admin/users/${id}`)
      .set('Authorization', 'Bearer admin').expect(200, { userId: id, name: 'Maria' });
    await request(app.getHttpServer()).get(`/admin/users/${id}/deletion-impact`)
      .set('Authorization', 'Bearer admin').expect(200, { userId: id, checkins: 2 });
  });

  it.each(['student', 'teacher', 'inactive'])(
    'bloqueia edição para %s',
    async (role) => {
      await request(app.getHttpServer())
        .patch(`/admin/users/${id}`)
        .set('Authorization', `Bearer ${role}`)
        .send({ name: 'Novo' })
        .expect(403);
      expect(service.update).not.toHaveBeenCalled();
    },
  );
  it('bloqueia edição sem token', async () => {
    await request(app.getHttpServer())
      .patch(`/admin/users/${id}`)
      .send({ name: 'Novo' })
      .expect(403);
  });
  it('permite admin ativo e transforma campos', async () => {
    await request(app.getHttpServer())
      .patch(`/admin/users/${id}`)
      .set('Authorization', 'Bearer admin')
      .send({ name: ' Novo ' })
      .expect(200);
    expect(service.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ name: 'Novo' }),
    );
  });
  it.each([
    { type: 'teacher' },
    { name: null },
    { name: 123 },
    { name: '  ' },
    { email: 'invalid' },
    { registrationStudent: '123' },
  ])('rejeita entrada inválida %j', async (body) => {
    await request(app.getHttpServer())
      .patch(`/admin/users/${id}`)
      .set('Authorization', 'Bearer admin')
      .send(body)
      .expect(400);
    expect(service.update).not.toHaveBeenCalled();
  });
  it('rejeita motivo contendo só espaços', async () => {
    await request(app.getHttpServer())
      .patch(`/admin/users/${id}/deactivate`)
      .set('Authorization', 'Bearer admin')
      .send({ reason: '  ' })
      .expect(400);
    expect(service.deactivate).not.toHaveBeenCalled();
  });
  it.each(['activate', 'deactivate'])(
    'bloqueia %s para professor',
    async (action) => {
      await request(app.getHttpServer())
        .patch(`/admin/users/${id}/${action}`)
        .set('Authorization', 'Bearer teacher')
        .send({ reason: 'Teste' })
        .expect(403);
    },
  );

  const destino = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
  const turma = '3f0d9f1e-8b7a-4d1c-9a2b-5c6d7e8f9a0b';

  it.each(['student', 'teacher', 'inactive'])(
    'bloqueia transferência de turmas para %s',
    async (role) => {
      await request(app.getHttpServer())
        .post(`/admin/teachers/${id}/transfer`)
        .set('Authorization', `Bearer ${role}`)
        .send({ destinationTeacherId: destino, classIds: [turma] })
        .expect(403);
      expect(teacherTransferService.transferClasses).not.toHaveBeenCalled();
    },
  );

  it.each([
    {},
    { destinationTeacherId: destino },
    { destinationTeacherId: destino, classIds: [] },
    { destinationTeacherId: destino, classIds: ['nao-e-uuid'] },
    { destinationTeacherId: 'nao-e-uuid', classIds: [turma] },
    { destinationTeacherId: destino, classIds: [turma], extra: 'campo' },
  ])('rejeita transferência com corpo inválido %j', async (body) => {
    await request(app.getHttpServer())
      .post(`/admin/teachers/${id}/transfer`)
      .set('Authorization', 'Bearer admin')
      .send(body)
      .expect(400);
    expect(teacherTransferService.transferClasses).not.toHaveBeenCalled();
  });

  it('entrega a transferência ao serviço com o admin autenticado', async () => {
    teacherTransferService.transferClasses.mockResolvedValue({
      sourceTeacherId: id,
      destinationTeacherId: destino,
    });
    await request(app.getHttpServer())
      .post(`/admin/teachers/${id}/transfer`)
      .set('Authorization', 'Bearer admin')
      .send({ destinationTeacherId: destino, classIds: [turma] })
      .expect(200, { sourceTeacherId: id, destinationTeacherId: destino });
    expect(teacherTransferService.transferClasses).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        destinationTeacherId: destino,
        classIds: [turma],
      }),
      'admin',
    );
  });
});
