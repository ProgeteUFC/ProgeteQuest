import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { assertClassAccess } from './classAccess';
import { ClassService } from '../class/class.service';
import { StudentClassService } from '../student_class/student_class.service';
import { StudentClassController } from '../student_class/student_class.controller';
import { ForumService } from '../forum/forum.service';
import { ActivityService } from '../activity/activity.service';
import { AssessmentService } from '../assessment/assessment.service';
import { CodeService } from '../code/code.service';
import { CheckinService } from '../checkin/checkin.service';
import { UserPayload } from '../decorators/user.decorator';

const user = (type: string, userId = 'caller'): UserPayload => ({
  type,
  userId,
  name: type,
  email: `${type}@test.com`,
  isAdmin: type === 'admin',
});

describe('Autorização por recurso', () => {
  const classes = { findOne: jest.fn(), exists: jest.fn() };
  beforeEach(() => {
    jest.resetAllMocks();
    classes.findOne.mockResolvedValue({ classId: 'class', teacherId: 'owner' });
  });

  it.each(['student', 'teacher'])(
    'nega acesso de %s sem vínculo com a turma',
    async (role) => {
      classes.exists.mockResolvedValue(false);
      await expect(
        assertClassAccess(classes as never, 'class', user(role)),
      ).rejects.toBeInstanceOf(ForbiddenException);
    },
  );
  it.each(['student', 'teacher', 'admin'])(
    'permite acesso de %s autorizado',
    async (role) => {
      classes.exists.mockResolvedValue(true);
      await expect(
        assertClassAccess(classes as never, 'class', user(role, 'owner')),
      ).resolves.toMatchObject({ classId: 'class' });
    },
  );
  it('exige professor explícito ao criar turma como administrador', async () => {
    const teachers = { findOne: jest.fn() };
    const service = new ClassService(
      classes as never,
      teachers as never,
      {} as never,
    );
    await expect(
      service.createClass({ name: 'Turma' }, user('admin')),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(teachers.findOne).not.toHaveBeenCalled();
  });
  it('nega ranking, participantes e matrícula em turma de outro professor', async () => {
    const memberships = { create: jest.fn(), save: jest.fn() };
    const students = { findOne: jest.fn(async () => ({ userId: 'student' })) };
    const service = new StudentClassService(
      memberships as never,
      {} as never,
      classes as never,
      students as never,
    );
    await expect(
      service.getClassRanking('class', user('student')),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.getClassParticipants('class', user('teacher')),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.enrollStudentByRegistration(
        '123456',
        'join-code',
        user('teacher'),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(memberships.save).not.toHaveBeenCalled();
  });
  it('admin pode consultar fórum sem assumir identidade do professor', async () => {
    classes.exists.mockResolvedValue(true);
    const forums = {
      findOne: jest.fn(async () => ({ forumId: 'forum', turmaId: 'class' })),
    };
    const service = new ForumService(
      forums as never,
      {} as never,
      {} as never,
      classes as never,
    );
    await expect(
      service.getForumByClass('class', {
        id: 'admin',
        isAdmin: true,
        isTeacher: false,
        isStudent: false,
      }),
    ).resolves.toMatchObject({ forumId: 'forum' });
    expect(classes.exists).toHaveBeenCalledWith({
      where: { classId: 'class' },
    });
  });
  it('professor e aluno continuam impedidos de consultar fórum alheio', async () => {
    const service = new ForumService(
      {} as never,
      {} as never,
      {} as never,
      classes as never,
    );
    for (const role of ['teacher', 'student'])
      await expect(
        service.getForumByClass('class', {
          id: 'other',
          isTeacher: role === 'teacher',
          isStudent: role === 'student',
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
  });
  it('bloqueia alteração de atividade e avaliação de outro professor', async () => {
    classes.findOne.mockResolvedValue(null);
    const resource = {
      findOne: jest.fn(async () => ({ classId: 'class' })),
      save: jest.fn(),
    };
    const activities = new ActivityService(
      resource as never,
      classes as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const assessments = new AssessmentService(
      resource as never,
      classes as never,
    );
    await expect(
      activities.updateActivity(
        'activity',
        { name: 'Alterada' },
        user('teacher'),
      ),
    ).rejects.toThrow();
    await expect(
      assessments.updateAssessment(
        'assessment',
        { name: 'Alterada' },
        user('teacher'),
      ),
    ).rejects.toThrow();
    expect(resource.save).not.toHaveBeenCalled();
  });
  it('admin não pode criar código para atividade inexistente', async () => {
    const codes = { save: jest.fn() };
    const service = new CodeService(
      codes as never,
      { findOne: jest.fn(async () => null) } as never,
      classes as never,
    );
    await expect(
      service.createCode({ activityId: 'missing' } as never, user('admin')),
    ).rejects.toThrow('Atividade não encontrada');
    expect(codes.save).not.toHaveBeenCalled();
  });
  it('admin precisa informar aluno e o código deve pertencer à atividade', async () => {
    const codes = { findOne: jest.fn(async () => null) };
    const service = new CheckinService(
      {} as never,
      {} as never,
      codes as never,
      {} as never,
    );
    await expect(
      service.createCheckin(
        { activityId: 'activity', code: 'ABC' },
        user('admin'),
      ),
    ).rejects.toThrow('explicitamente');
    await expect(
      service.createCheckin(
        { activityId: 'activity', code: 'ABC' },
        user('student'),
      ),
    ).rejects.toThrow('Código não encontrado');
    expect(codes.findOne).toHaveBeenCalledWith({
      where: { activityId: 'activity', code: 'ABC' },
    });
  });
  it('esconde o joinCode do aluno e mantém para professor e admin', async () => {
    const find = jest.fn(async (_options: Record<string, any>) => [] as any[]);
    const service = new ClassService({ find } as never, {} as never, {} as never);
    await service.getAllClasses(user('student'));
    await service.getAllClasses(user('teacher'));
    await service.getAllClasses(user('admin'));
    expect(find.mock.calls[0][0].select).not.toHaveProperty('joinCode');
    expect(find.mock.calls[1][0].select).toMatchObject({ joinCode: true });
    expect(find.mock.calls[2][0].select).toMatchObject({ joinCode: true });
  });
  it('searchClasses não devolve joinCode para aluno, mas devolve para professor e admin', async () => {
    const qb: Record<string, any> = {
      getMany: jest.fn(async () => [
        {
          classId: 'class',
          name: 'Turma',
          teacherId: 'owner',
          joinCode: 'SEGREDO123',
        },
      ]),
    };
    qb.innerJoin = jest.fn(() => qb);
    qb.andWhere = jest.fn(() => qb);
    const service = new ClassService(
      { createQueryBuilder: jest.fn(() => qb) } as never,
      {} as never,
      {} as never,
    );
    const comoAluno = await service.searchClasses({}, user('student'));
    expect(comoAluno[0]).not.toHaveProperty('joinCode');
    expect(JSON.stringify(comoAluno)).not.toContain('SEGREDO123');
    expect(JSON.stringify(await service.searchClasses({}, user('teacher', 'owner')))).toContain('SEGREDO123');
    expect(JSON.stringify(await service.searchClasses({}, user('admin')))).toContain('SEGREDO123');
  });
  it('getClassById mantém joinCode para admin', async () => {
    const service = new ClassService(classes as never, {} as never, {} as never);
    classes.findOne.mockResolvedValue({ classId: 'class' });
    await service.getClassById('class', user('admin'));
    expect(classes.findOne.mock.calls[0][0].select).toMatchObject({
      joinCode: true,
    });
  });
  it('getClassById não devolve joinCode para aluno', async () => {
    const service = new ClassService(classes as never, {} as never, {} as never);
    classes.findOne.mockResolvedValue({ classId: 'class', name: 'Turma' });
    await service.getClassById('class', user('student'));
    expect(classes.findOne.mock.calls[0][0].select).not.toHaveProperty(
      'joinCode',
    );
  });
  it('getStudentClasses não devolve joinCode', async () => {
    const students = { findOne: jest.fn(async () => ({ userId: 'student' })) };
    const memberships = {
      find: jest.fn(async () => [
        {
          class: {
            classId: 'class',
            name: 'Turma',
            joinCode: 'SEGREDO123',
            teacherId: 'owner',
          },
        },
      ]),
    };
    const service = new StudentClassService(
      memberships as never,
      {} as never,
      classes as never,
      students as never,
    );
    const turmas = await service.getStudentClasses('student');
    expect(turmas[0]).not.toHaveProperty('joinCode');
    expect(JSON.stringify(turmas)).not.toContain('SEGREDO123');
  });
  it('GET do fórum só materializa a turma para quem é membro dela', async () => {
    const forums = {
      findOne: jest.fn(async () => null),
      create: jest.fn((forum) => forum),
      save: jest.fn(async (forum) => forum),
    };
    const service = new ForumService(
      forums as never,
      {} as never,
      {} as never,
      classes as never,
    );

    // Quem não pertence à turma não passa nem do validateUserInClass.
    classes.exists.mockResolvedValue(false);
    for (const estranho of [
      { id: 'outro', isTeacher: false, isStudent: true },
      { id: 'outro', isTeacher: true, isStudent: false },
    ])
      await expect(
        service.getForumByClass('class', estranho),
      ).rejects.toBeInstanceOf(ForbiddenException);
    expect(forums.save).not.toHaveBeenCalled();

    // Membros (aluno matriculado, professor dono, admin) recebem o fórum.
    classes.exists.mockResolvedValue(true);
    for (const membro of [
      { id: 'aluno', isTeacher: false, isStudent: true },
      { id: 'owner', isTeacher: true, isStudent: false },
      { id: 'admin', isAdmin: true, isTeacher: false, isStudent: false },
    ])
      await expect(
        service.getForumByClass('class', membro),
      ).resolves.toMatchObject({ turmaId: 'class' });
    expect(forums.save).toHaveBeenCalledTimes(3);
  });
  it('DELETE /student-class exige classId com 400', async () => {
    const controller = new StudentClassController({} as never);
    await expect(
      controller.remove({ classId: '', studentId: 'x' } as never, user('teacher')),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
