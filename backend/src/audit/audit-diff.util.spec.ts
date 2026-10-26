import { buildChanges } from './audit-diff.util';

describe('buildChanges', () => {
  const allowedFields = [
    'name',
    'email',
    'registrationStudent',
    'registrationTeacher',
    'type',
    'status',
    'deactivatedAt',
    'deactivatedBy',
    'deactivationReason',
  ] as const;

  it('ignora campos fora da lista, incluindo password', () => {
    const before = {
      name: 'Ana',
      password: 'hash-antigo',
      ignored: 'ok',
    };
    const after = {
      name: 'Ana Souza',
      password: 'hash-novo',
      ignored: 'muda',
    };

    expect(buildChanges(before, after, allowedFields)).toEqual({
      name: {
        before: 'Ana',
        after: 'Ana Souza',
      },
    });
  });

  it('considera null e undefined como iguais', () => {
    expect(
      buildChanges({ email: null }, { email: undefined }, allowedFields),
    ).toEqual({});
  });

  it('compara Date corretamente e serializa em ISO', () => {
    const first = new Date('2024-01-01T00:00:00.000Z');
    const same = new Date('2024-01-01T00:00:00.000Z');
    const later = new Date('2024-01-02T00:00:00.000Z');

    expect(
      buildChanges(
        { deactivatedAt: first },
        { deactivatedAt: same },
        allowedFields,
      ),
    ).toEqual({});

    expect(
      buildChanges(
        { deactivatedAt: first },
        { deactivatedAt: later },
        allowedFields,
      ),
    ).toEqual({
      deactivatedAt: {
        before: '2024-01-01T00:00:00.000Z',
        after: '2024-01-02T00:00:00.000Z',
      },
    });
  });

  it('na criação, registra só os campos preenchidos', () => {
    expect(
      buildChanges(
        null,
        {
          name: 'Maria',
          email: 'maria@exemplo.com',
          password: 'secret',
          status: 'active',
        },
        allowedFields,
      ),
    ).toEqual({
      name: {
        before: null,
        after: 'Maria',
      },
      email: {
        before: null,
        after: 'maria@exemplo.com',
      },
      status: {
        before: null,
        after: 'active',
      },
    });
  });

  it('retorna {} quando não há alteração', () => {
    expect(
      buildChanges(
        { name: 'Maria', email: 'maria@exemplo.com' },
        { name: 'Maria', email: 'maria@exemplo.com' },
        allowedFields,
      ),
    ).toEqual({});
  });
});
