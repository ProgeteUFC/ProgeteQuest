import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Class } from '../class/entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { User } from '../user/entities/user.entity';
import { Activity } from '../activity/entities/activity.entity';
import { Assessment } from '../assessment/entities/assessment.entity';
import { Forum } from '../forum/entities/forum.entity';
import { StudentClass } from '../student_class/entities/studentClass.entity';
import { validate } from 'class-validator';
import { UserStatus, UserType } from '../Enums/user.enum';
import { TransferClassesDto } from './dtos/transfer-classes.dto';
import { TeacherTransferService } from './teacher-transfer.service';

const ORIGEM = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const DESTINO = '550e8400-e29b-41d4-a716-446655440000';
const ADMIN = '11111111-1111-4111-8111-111111111111';
const TURMA_A = '3f0d9f1e-8b7a-4d1c-9a2b-5c6d7e8f9a0b';
const TURMA_B = '7c1e2d3f-4a5b-4c6d-8e9f-0a1b2c3d4e5f';

type Cenario = {
  users?: Record<string, Partial<User>>;
  teacherProfiles?: string[];
  classes?: Array<Partial<Class>>;
  counts?: Record<string, number>;
};

const professor = (userId: string, status: UserStatus): Partial<User> => ({
  userId,
  type: UserType.TEACHER,
  status,
});

const cenarioPadrao = (): Required<Cenario> => ({
  // O caso típico: professor de origem já desligado, destino ativo.
  users: {
    [ORIGEM]: professor(ORIGEM, UserStatus.INACTIVE),
    [DESTINO]: professor(DESTINO, UserStatus.ACTIVE),
  },
  teacherProfiles: [ORIGEM, DESTINO],
  classes: [
    { classId: TURMA_A, name: 'Algoritmos I', teacherId: ORIGEM },
    { classId: TURMA_B, name: 'Estruturas de Dados', teacherId: ORIGEM },
  ],
  counts: { enrollments: 32, assessments: 4, activities: 12, forums: 2 },
});

const montar = (ajustes: Cenario = {}) => {
  const cenario = { ...cenarioPadrao(), ...ajustes };

  const manager = {
    findOne: jest.fn(
      (entity: unknown, options: { where: { userId: string } }) => {
        const { userId } = options.where;
        if (entity === User) {
          return Promise.resolve(cenario.users[userId] ?? null);
        }
        if (entity === Teacher) {
          return Promise.resolve(
            cenario.teacherProfiles.includes(userId) ? { userId } : null,
          );
        }
        return Promise.resolve(null);
      },
    ),
    find: jest.fn(() => Promise.resolve(cenario.classes)),
    update: jest.fn(),
    countBy: jest.fn((entity: unknown) => {
      const porEntidade = new Map<unknown, number>([
        [StudentClass, cenario.counts.enrollments],
        [Assessment, cenario.counts.assessments],
        [Activity, cenario.counts.activities],
        [Forum, cenario.counts.forums],
      ]);
      return Promise.resolve(porEntidade.get(entity) ?? 0);
    }),
  };

  const auditTrail = { record: jest.fn() };
  const service = new TeacherTransferService(
    {
      transaction: (run: (manager: unknown) => Promise<unknown>) =>
        run(manager),
    } as never,
    auditTrail,
  );

  return { service, manager, auditTrail, cenario };
};

const transferir = (
  service: TeacherTransferService,
  classIds = [TURMA_A, TURMA_B],
) =>
  service.transferClasses(
    ORIGEM,
    { destinationTeacherId: DESTINO, classIds },
    ADMIN,
  );

describe('TeacherTransferService.transferClasses', () => {
  beforeEach(() => jest.clearAllMocks());

  it('apenas troca o responsável pelas turmas, sem apagar registro acadêmico', async () => {
    const { service, manager } = montar();

    const resultado = await transferir(service);

    expect(manager.update).toHaveBeenCalledTimes(1);
    const [entidade, criterio, mudanca] = manager.update.mock.calls[0] as [
      unknown,
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(entidade).toBe(Class);
    expect(Object.keys(criterio)).toEqual(['classId']);
    // A única coluna tocada é o dono da turma.
    expect(mudanca).toEqual({ teacherId: DESTINO });
    expect(resultado).toMatchObject({
      sourceTeacherId: ORIGEM,
      destinationTeacherId: DESTINO,
      transferredClasses: [
        { classId: TURMA_A, name: 'Algoritmos I' },
        { classId: TURMA_B, name: 'Estruturas de Dados' },
      ],
      preservedRelations: {
        enrollments: 32,
        assessments: 4,
        activities: 12,
        forums: 2,
      },
    });
  });

  it('confere matrículas, avaliações, atividades e fóruns antes e depois da troca', async () => {
    const { service, manager } = montar();

    await transferir(service);

    const entidadesConferidas = manager.countBy.mock.calls.map(
      ([entidade]) => entidade,
    );
    for (const entidade of [StudentClass, Assessment, Activity, Forum]) {
      expect(
        entidadesConferidas.filter((conferida) => conferida === entidade),
      ).toHaveLength(2);
    }
  });

  it('entrega o evento de auditoria dentro da mesma transação da transferência', async () => {
    const { service, manager, auditTrail } = montar();

    await transferir(service);

    const [evento, managerDaTrilha] = auditTrail.record.mock.calls[0] as [
      Record<string, unknown>,
      unknown,
    ];
    expect(managerDaTrilha).toBe(manager);
    expect(evento).toMatchObject({
      action: 'teacher.classes.transferred',
      actorId: ADMIN,
      entity: 'teacher',
      entityId: ORIGEM,
      details: {
        sourceTeacherId: ORIGEM,
        destinationTeacherId: DESTINO,
        classIds: [TURMA_A, TURMA_B],
      },
    });
  });

  it('recusa quando o professor de origem não existe', async () => {
    const { service, manager } = montar({
      users: { [DESTINO]: professor(DESTINO, UserStatus.ACTIVE) },
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(NotFoundException);
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa quando o professor de destino não existe', async () => {
    const { service, manager } = montar({
      users: { [ORIGEM]: professor(ORIGEM, UserStatus.INACTIVE) },
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(NotFoundException);
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa quando o professor de destino está inativo', async () => {
    const { service, manager } = montar({
      users: {
        [ORIGEM]: professor(ORIGEM, UserStatus.INACTIVE),
        [DESTINO]: professor(DESTINO, UserStatus.INACTIVE),
      },
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa quando o usuário de destino não tem perfil de professor', async () => {
    const { service, manager } = montar({
      users: {
        [ORIGEM]: professor(ORIGEM, UserStatus.INACTIVE),
        [DESTINO]: {
          userId: DESTINO,
          type: UserType.STUDENT,
          status: UserStatus.ACTIVE,
        },
      },
      teacherProfiles: [ORIGEM],
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa quando o usuário de origem não tem perfil de professor', async () => {
    const { service, manager } = montar({ teacherProfiles: [DESTINO] });

    await expect(transferir(service)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa a transferência inteira quando alguma turma é de outro professor', async () => {
    const { service, manager } = montar({
      classes: [
        { classId: TURMA_A, name: 'Algoritmos I', teacherId: ORIGEM },
        {
          classId: TURMA_B,
          name: 'Turma alheia',
          teacherId: 'f0e1d2c3-b4a5-4968-8778-695a4b3c2d1e',
        },
      ],
    });

    await expect(transferir(service)).rejects.toThrow(/não pertencem/);
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa a transferência inteira quando alguma turma não existe', async () => {
    const { service, manager } = montar({
      classes: [{ classId: TURMA_A, name: 'Algoritmos I', teacherId: ORIGEM }],
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(NotFoundException);
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('recusa transferir um professor para ele mesmo', async () => {
    const { service, manager } = montar();

    await expect(
      service.transferClasses(
        ORIGEM,
        { destinationTeacherId: ORIGEM, classIds: [TURMA_A] },
        ADMIN,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(manager.update).not.toHaveBeenCalled();
  });

  it('derruba a transação e não audita quando algum vínculo acadêmico some', async () => {
    const { service, auditTrail, manager, cenario } = montar();
    // Simula uma exclusão em cascata inesperada durante o UPDATE.
    manager.update.mockImplementation(() => {
      cenario.counts.enrollments = 0;
      return Promise.resolve(undefined);
    });

    await expect(transferir(service)).rejects.toBeInstanceOf(ConflictException);
    expect(auditTrail.record).not.toHaveBeenCalled();
  });
});

describe('TransferClassesDto', () => {
  const pedido = (valores: Partial<TransferClassesDto>) =>
    Object.assign(new TransferClassesDto(), {
      destinationTeacherId: DESTINO,
      classIds: [TURMA_A],
      ...valores,
    });

  const propriedadesComErro = async (dto: TransferClassesDto) =>
    (await validate(dto)).map((erro) => erro.property);

  it('aceita destino e turmas em formato de UUID', async () => {
    await expect(validate(pedido({}))).resolves.toHaveLength(0);
  });

  it('exige ao menos uma turma', async () => {
    await expect(
      propriedadesComErro(pedido({ classIds: [] })),
    ).resolves.toContain('classIds');
  });

  it('rejeita IDs de turma fora do formato UUID', async () => {
    await expect(
      propriedadesComErro(pedido({ classIds: [TURMA_A, 'nao-e-uuid'] })),
    ).resolves.toContain('classIds');
  });

  it('rejeita a mesma turma repetida na lista', async () => {
    await expect(
      propriedadesComErro(pedido({ classIds: [TURMA_A, TURMA_A] })),
    ).resolves.toContain('classIds');
  });

  it('rejeita destino fora do formato UUID', async () => {
    await expect(
      propriedadesComErro(pedido({ destinationTeacherId: 'nao-e-uuid' })),
    ).resolves.toContain('destinationTeacherId');
  });
});
