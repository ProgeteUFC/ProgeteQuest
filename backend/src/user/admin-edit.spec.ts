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
  let manager: {
    create: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    query: jest.Mock;
  };
  let transaction: jest.Mock;
  let user: User;
  let auditService: { record: jest.Mock };

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
      create: jest.fn((entity, values) => ({ ...values })),
      findOne: jest.fn(async (entity, options) => {
        if (entity === User && options.where.userId === 'target')
          return { ...user };
        if (entity === Student && options.where.userId === 'target')
          return { userId: 'target', registrationStudent: '123456' };
        return null;
      }),
      save: jest.fn(async (_, value) => value ?? _),
      query: jest.fn(async () => []),
    };
    transaction = jest.fn(async (work) => work(manager));
    auditService = { record: jest.fn() };
    service = new UserService(
      { findOne: jest.fn(async () => null) } as never,
      { findOne: jest.fn(async () => null) } as never,
      { findOne: jest.fn(async () => null) } as never,
      { findOne: jest.fn(async () => null) } as never,
      { transaction } as never,
      auditService as never,
    );
    jest.clearAllMocks();
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

  it('registra USER_UPDATED com o mesmo manager para edição administrativa', async () => {
    const result = await service.update(
      'target',
      {
        name: 'Novo nome',
        email: 'novo@exemplo.com',
      },
      { adminId: 'admin-1' },
    );

    expect(auditService.record).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledWith(
      manager,
      expect.objectContaining({
        action: 'USER_UPDATED',
        adminId: 'admin-1',
        targetUserId: 'target',
        reason: null,
        resourceIds: { userId: 'target' },
      }),
    );

    const payload = auditService.record.mock.calls[0][1];
    expect(payload.changes).toEqual({
      name: { before: 'Aluno', after: 'Novo nome' },
      email: { before: 'aluno@exemplo.com', after: 'novo@exemplo.com' },
    });
    expect(payload.changes).not.toHaveProperty('password');
    expect(result).toMatchObject({ userId: 'target', status: UserStatus.ACTIVE });
  });

  it('não grava auditoria quando não há contexto administrativo', async () => {
    await service.update('target', { name: 'Mudança sem contexto' });
    expect(auditService.record).not.toHaveBeenCalled();
  });

  it('rejeita password em edição administrativa antes de gravar', async () => {
    await expect(
      service.update(
        'target',
        { password: 'NovaSenha123!' },
        { adminId: 'admin-1' },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(auditService.record).not.toHaveBeenCalled();
  });

  it('aceita password na edição do próprio perfil sem contexto', async () => {
    await expect(
      service.update('target', { password: ' NovaSenha123! ' }),
    ).resolves.toMatchObject({ userId: 'target' });
    expect(auditService.record).not.toHaveBeenCalled();
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

  it('rejeita quando a auditoria falha dentro da transação', async () => {
    auditService.record.mockRejectedValueOnce(new Error('audit failed'));
    await expect(
      service.update(
        'target',
        { name: 'Novo nome' },
        { adminId: 'admin-1' },
      ),
    ).rejects.toThrow('audit failed');
  });

  it('traduz conflito de unicidade concorrente em 409', async () => {
    manager.save.mockRejectedValue({ driverError: { code: '23505' } });
    await expect(
      service.update('target', { email: 'outro@exemplo.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

  it('cria usuário administrativo com auditoria e sem senha no diff', async () => {
    const userId = 'user-created-1';
    manager.create.mockImplementation((entity, values) => ({
      ...values,
      userId,
    }));
    manager.findOne.mockImplementation(async (entity, options) => {
      if (entity === User && options.where.userId === userId) {
        return {
          userId,
          name: 'Admin Novo',
          email: 'admin.novo@exemplo.com',
          type: UserType.ADMIN,
          status: UserStatus.ACTIVE,
          deactivatedAt: null,
          deactivatedBy: null,
          deactivationReason: null,
        };
      }
      return null;
    });

    const created = await service.create(
      {
        name: 'Admin Novo',
        email: 'admin.novo@exemplo.com',
        password: 'senha123',
        type: UserType.ADMIN,
      },
      { adminId: 'admin-1' },
    );

    expect(created.userId).toBe(userId);
    expect(auditService.record).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledWith(
      manager,
      expect.objectContaining({
        action: 'USER_CREATED',
        adminId: 'admin-1',
        targetUserId: userId,
        reason: null,
      }),
    );

    const payload = auditService.record.mock.calls[0][1];
    expect(payload.changes).toEqual({
      name: { before: null, after: 'Admin Novo' },
      email: { before: null, after: 'admin.novo@exemplo.com' },
      type: { before: null, after: UserType.ADMIN },
      status: { before: null, after: UserStatus.ACTIVE },
    });
    expect(payload.changes).not.toHaveProperty('password');
  });

  it('criação sem contexto não grava auditoria', async () => {
    await service.create({
      name: 'Publico',
      email: 'publico@exemplo.com',
      password: 'senha123',
      type: UserType.STUDENT,
      registrationStudent: '123456',
    });
    expect(auditService.record).not.toHaveBeenCalled();
  });

  it('criação administrativa rejeita quando a auditoria falha dentro da transação', async () => {
    auditService.record.mockRejectedValueOnce(new Error('audit failed'));

    await expect(
      service.create(
        {
          name: 'Prof Novo',
          email: 'prof.novo@exemplo.com',
          password: 'senha123',
          type: UserType.TEACHER,
          registrationTeacher: '654321',
        },
        { adminId: 'admin-1' },
      ),
    ).rejects.toThrow('audit failed');
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
      { adminId: 'admin' },
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
