import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserStatus, UserType } from '../Enums/user.enum';
import {
  CONFIRMATION_PHRASE,
  PermanentlyDeleteUserDto,
} from './dtos/permanently-delete-user.dto';
import { PermanentUserDeletionService } from './permanent-user-deletion.service';

jest.mock('bcrypt', () => ({ compare: jest.fn() }));

const comparar = bcrypt.compare as unknown as jest.Mock;

const ADMIN = '11111111-1111-4111-8111-111111111111';
const ALVO = '22222222-2222-4222-8222-222222222222';

const corpoValido = (): PermanentlyDeleteUserDto =>
  Object.assign(new PermanentlyDeleteUserDto(), {
    confirmation: CONFIRMATION_PHRASE,
    reason: 'Conta duplicada, confirmada após revisão dos dados vinculados.',
    adminPassword: 'senha-do-admin',
  });

type Impacto = {
  canDelete: boolean;
  hasDependencies: boolean;
  blockedReasons: string[];
};

type Cenario = {
  users?: Record<string, Partial<User>>;
  impacto?: Impacto;
  /** Administradores ativos que sobrariam se o alvo fosse excluído. */
  adminsAtivosRestantes?: number;
  senhaConfere?: boolean;
};

const cenarioPadrao = (): Required<Cenario> => ({
  // O caso típico: admin ativo excluindo um professor já desativado e sem
  // nenhum vínculo acadêmico remanescente.
  users: {
    [ADMIN]: {
      userId: ADMIN,
      type: UserType.ADMIN,
      status: UserStatus.ACTIVE,
      password: 'hash-do-admin',
    },
    [ALVO]: {
      userId: ALVO,
      type: UserType.TEACHER,
      status: UserStatus.INACTIVE,
      password: 'hash-do-alvo',
    },
  },
  impacto: { canDelete: true, hasDependencies: false, blockedReasons: [] },
  adminsAtivosRestantes: 2,
  senhaConfere: true,
});

const montar = (ajustes: Cenario = {}) => {
  const cenario = { ...cenarioPadrao(), ...ajustes };
  comparar.mockResolvedValue(cenario.senhaConfere);

  const manager = {
    query: jest.fn(),
    findOne: jest.fn(
      (entity: unknown, options: { where: { userId: string } }) =>
        Promise.resolve(
          entity === User
            ? (cenario.users[options.where.userId] ?? null)
            : null,
        ),
    ),
    count: jest.fn(() => Promise.resolve(cenario.adminsAtivosRestantes)),
    delete: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const userService = {
    getDeletionImpact: jest.fn(() => Promise.resolve(cenario.impacto)),
  };
  const service = new PermanentUserDeletionService(
    {
      transaction: (run: (manager: unknown) => Promise<unknown>) =>
        run(manager),
    } as never,
    userService as never,
  );

  const alvoFoiLido = () =>
    manager.findOne.mock.calls.some(
      ([, options]: [unknown, { where: { userId: string } }]) =>
        options.where.userId === ALVO,
    );

  return { service, manager, userService, alvoFoiLido };
};

describe('PermanentUserDeletionService.validate', () => {
  beforeEach(() => jest.clearAllMocks());

  it('aprova a exclusão sem apagar nada quando todas as regras passam', async () => {
    const { service, manager } = montar();

    const liberacao = await service.validate(ALVO, ADMIN, corpoValido());

    expect(liberacao).toMatchObject({ userId: ALVO, executed: false });
    expect(manager.delete).not.toHaveBeenCalled();
    expect(manager.remove).not.toHaveBeenCalled();
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('devolve o impacto consultado para a tela de confirmação', async () => {
    const { service, userService } = montar();

    const liberacao = await service.validate(ALVO, ADMIN, corpoValido());

    expect(userService.getDeletionImpact).toHaveBeenCalledWith(
      ALVO,
      expect.anything(),
    );
    expect(liberacao.impact).toEqual(cenarioPadrao().impacto);
  });

  it('recusa quem não é administrador', async () => {
    const { service } = montar({
      users: {
        [ADMIN]: {
          userId: ADMIN,
          type: UserType.TEACHER,
          status: UserStatus.ACTIVE,
          password: 'hash-do-admin',
        },
        [ALVO]: cenarioPadrao().users[ALVO],
      },
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('recusa administrador que já foi desativado', async () => {
    const { service } = montar({
      users: {
        [ADMIN]: {
          userId: ADMIN,
          type: UserType.ADMIN,
          status: UserStatus.INACTIVE,
          password: 'hash-do-admin',
        },
        [ALVO]: cenarioPadrao().users[ALVO],
      },
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('recusa quando a senha do administrador não confere', async () => {
    const { service } = montar({ senhaConfere: false });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('confere a senha contra o hash do próprio administrador', async () => {
    const { service } = montar();

    await service.validate(ALVO, ADMIN, corpoValido());

    expect(comparar).toHaveBeenCalledWith('senha-do-admin', 'hash-do-admin');
  });

  it('não revela nada sobre o alvo antes de a senha ser aceita', async () => {
    const { service, userService, alvoFoiLido } = montar({
      senhaConfere: false,
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toThrow();

    expect(alvoFoiLido()).toBe(false);
    expect(userService.getDeletionImpact).not.toHaveBeenCalled();
  });

  it('recusa quando o usuário selecionado não existe', async () => {
    const { service } = montar({
      users: { [ADMIN]: cenarioPadrao().users[ADMIN] },
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('recusa o administrador que tenta excluir a própria conta', async () => {
    const { service } = montar();

    await expect(
      service.validate(ADMIN, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('recusa quando o usuário selecionado ainda está ativo', async () => {
    const { service } = montar({
      users: {
        [ADMIN]: cenarioPadrao().users[ADMIN],
        [ALVO]: {
          userId: ALVO,
          type: UserType.TEACHER,
          status: UserStatus.ACTIVE,
          password: 'hash-do-alvo',
        },
      },
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('recusa quando o impacto aponta dependências impeditivas', async () => {
    const { service } = montar({
      impacto: {
        canDelete: false,
        hasDependencies: true,
        blockedReasons: ['Existem vínculos ou histórico acadêmico.'],
      },
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('entrega o impacto junto da recusa por dependências', async () => {
    const impacto = {
      canDelete: false,
      hasDependencies: true,
      blockedReasons: ['Existem vínculos ou histórico acadêmico.'],
    };
    const { service } = montar({ impacto });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toMatchObject({ response: { impact: impacto } });
  });

  it('recusa quando a exclusão deixaria o sistema sem administrador ativo', async () => {
    const { service } = montar({
      users: {
        [ADMIN]: cenarioPadrao().users[ADMIN],
        [ALVO]: {
          userId: ALVO,
          type: UserType.ADMIN,
          status: UserStatus.INACTIVE,
          password: 'hash-do-alvo',
        },
      },
      adminsAtivosRestantes: 0,
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('permite excluir um administrador quando outro ativo permanece', async () => {
    const { service } = montar({
      users: {
        [ADMIN]: cenarioPadrao().users[ADMIN],
        [ALVO]: {
          userId: ALVO,
          type: UserType.ADMIN,
          status: UserStatus.INACTIVE,
          password: 'hash-do-alvo',
        },
      },
      adminsAtivosRestantes: 1,
    });

    await expect(
      service.validate(ALVO, ADMIN, corpoValido()),
    ).resolves.toMatchObject({ executed: false });
  });

  // A auditoria é gravada por `AuditService.record`, que persiste via
  // `manager.create` + `manager.save`. Checar que nenhum dos dois é chamado
  // cobre de uma vez "não apaga" e "não registra exclusão que não houve".
  it('não grava nada no banco durante a checagem, nem auditoria', async () => {
    const { service, manager } = montar();

    await service.validate(ALVO, ADMIN, corpoValido());

    expect(manager.save).not.toHaveBeenCalled();
    expect(manager.create).not.toHaveBeenCalled();
  });
});

describe('PermanentlyDeleteUserDto', () => {
  const pedido = (valores: Record<string, unknown>) =>
    plainToInstance(PermanentlyDeleteUserDto, {
      confirmation: CONFIRMATION_PHRASE,
      reason: 'Conta duplicada, confirmada após revisão dos dados vinculados.',
      adminPassword: 'senha-do-admin',
      ...valores,
    });

  const propriedadesComErro = async (dto: PermanentlyDeleteUserDto) =>
    (await validate(dto)).map((erro) => erro.property);

  it('aceita confirmação, motivo e senha preenchidos', async () => {
    await expect(validate(pedido({}))).resolves.toHaveLength(0);
  });

  it('exige a frase exata de confirmação', async () => {
    await expect(
      propriedadesComErro(pedido({ confirmation: 'EXCLUIR' })),
    ).resolves.toContain('confirmation');
  });

  it('não aceita a frase de confirmação em caixa baixa', async () => {
    await expect(
      propriedadesComErro(pedido({ confirmation: 'excluir definitivamente' })),
    ).resolves.toContain('confirmation');
  });

  it('ignora espaços ao redor da frase de confirmação', async () => {
    await expect(
      validate(pedido({ confirmation: `  ${CONFIRMATION_PHRASE}  ` })),
    ).resolves.toHaveLength(0);
  });

  it('rejeita confirmação que não é texto', async () => {
    await expect(
      propriedadesComErro(pedido({ confirmation: true })),
    ).resolves.toContain('confirmation');
  });

  it('exige um motivo com conteúdo', async () => {
    await expect(
      propriedadesComErro(pedido({ reason: '   ' })),
    ).resolves.toContain('reason');
  });

  it('limita o tamanho do motivo', async () => {
    await expect(
      propriedadesComErro(pedido({ reason: 'x'.repeat(501) })),
    ).resolves.toContain('reason');
  });

  it('exige a senha do administrador', async () => {
    await expect(
      propriedadesComErro(pedido({ adminPassword: '' })),
    ).resolves.toContain('adminPassword');
  });

  it('preserva a senha exatamente como digitada', () => {
    expect(pedido({ adminPassword: ' com espaços ' }).adminPassword).toBe(
      ' com espaços ',
    );
  });
});
