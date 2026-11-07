import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserStatus } from 'src/Enums/user.enum';

const SELF_DELETION_DISABLED_MESSAGE =
  'A exclusão da própria conta está temporariamente indisponível. Procure a administração da plataforma para solicitar a exclusão ou esclarecer dúvidas.';
const SELF_DELETION_DISABLED_CODE = 'ACCOUNT_SELF_DELETION_DISABLED';

describe('POST /user/delete', () => {
  let app: INestApplication;
  let userService: { remove: jest.Mock };
  let jwtService: { verifyAsync: jest.Mock };
  let userRepository: { findOne: jest.Mock };

  const buildApp = async (role: 'student' | 'teacher' | 'admin') => {
    userService = { remove: jest.fn() };
    jwtService = { verifyAsync: jest.fn() };
    userRepository = {
      findOne: jest.fn(async () => ({
        userId: 'user-1',
        email: 'user@example.com',
        name: 'Usuário Teste',
        type: role,
        status: UserStatus.ACTIVE,
        admins: role === 'admin' ? [{ userId: 'user-1' }] : [],
        students: role === 'student' ? [{ userId: 'user-1' }] : [],
        teachers: role === 'teacher' ? [{ userId: 'user-1' }] : [],
      })),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        RolesGuard,
        Reflector,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalGuards(app.get(RolesGuard));
    await app.init();
  };

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it.each([
    ['student', 'student'],
    ['teacher', 'teacher'],
    ['admin', 'admin'],
  ])('returns 403 for %s with the disabled self-deletion payload', async (_, role) => {
    await buildApp(role as 'student' | 'teacher' | 'admin');

    jwtService.verifyAsync.mockResolvedValue({
      user: {
        userId: 'user-1',
        email: 'user@example.com',
        name: 'Usuário Teste',
        type: role,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/user/delete')
      .set('Authorization', 'Bearer valid-token')
      .send({ password: 'SenhaValida123!' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      error: 'Forbidden',
      message: SELF_DELETION_DISABLED_MESSAGE,
      code: SELF_DELETION_DISABLED_CODE,
    });
    expect(userService.remove).not.toHaveBeenCalled();
  });

  it.each([
    ['body ausente', undefined],
    ['body vazio', {}],
    ['senha correta', { password: 'SenhaValida123!' }],
  ])('always returns the same 403 for %s', async (_, payload) => {
    await buildApp('student');

    jwtService.verifyAsync.mockResolvedValue({
      user: {
        userId: 'user-1',
        email: 'user@example.com',
        name: 'Usuário Teste',
        type: 'student',
      },
    });

    const requestBuilder = request(app.getHttpServer())
      .post('/user/delete')
      .set('Authorization', 'Bearer valid-token');

    const response = payload === undefined ? await requestBuilder : await requestBuilder.send(payload);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      error: 'Forbidden',
      message: SELF_DELETION_DISABLED_MESSAGE,
      code: SELF_DELETION_DISABLED_CODE,
    });
    expect(userService.remove).not.toHaveBeenCalled();
  });

  it('returns 403 without a token before reaching the handler', async () => {
    await buildApp('teacher');

    const response = await request(app.getHttpServer()).post('/user/delete');

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden resource',
    });
    expect(userService.remove).not.toHaveBeenCalled();
  });
});
