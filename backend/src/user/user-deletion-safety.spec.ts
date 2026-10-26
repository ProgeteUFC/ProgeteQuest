import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserStatus } from '../Enums/user.enum';
import { AuditAction } from '../Enums/audit-action.enum';

jest.mock('bcrypt', () => ({ compare: jest.fn(async () => true) }));

describe('User deletion safety', () => {
  const manager = {
    query: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ userId: 'admin-1' }]),
    })),
    findOne: jest.fn(async () => ({
      userId: 'target',
      type: 'teacher',
      status: UserStatus.ACTIVE,
      password: 'hash',
    })),
    save: jest.fn(async (user) => user),
    delete: jest.fn(),
  };
  const auditService = { record: jest.fn() };
  const service = new UserService(
    {
      findOne: jest.fn(async () => ({ userId: 'target', password: 'hash' })),
    } as never,
    {} as never,
    {} as never,
    {} as never,
    {
      transaction: async (run: (manager: unknown) => Promise<void>) =>
        run(manager),
    } as never,
    auditService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    manager.findOne.mockImplementation(async () => ({
      userId: 'target',
      type: 'teacher',
      status: UserStatus.ACTIVE,
      password: 'hash',
    }));
    manager.save.mockImplementation(async (user) => user);
  });

  it('does not delete profiles or history when impact contains dependencies', async () => {
    jest
      .spyOn(service, 'getDeletionImpact')
      .mockResolvedValue({ canDelete: false } as never);
    await expect(service.remove('target', 'password')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });

  it('propagates a late foreign key conflict outside the transaction for rollback', async () => {
    jest
      .spyOn(service, 'getDeletionImpact')
      .mockResolvedValue({ canDelete: true } as never);
    manager.delete.mockRejectedValueOnce({ driverError: { code: '23503' } });
    await expect(service.remove('target', 'password')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(manager.delete).toHaveBeenCalledTimes(1);
  });
  
  it('records USER_DEACTIVATED with the same manager and a status diff only', async () => {
    const result = await service.deactivate('target', 'admin-1', 'Motivo');

    expect(auditService.record).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledWith(
      manager,
      expect.objectContaining({
        action: AuditAction.USER_DEACTIVATED,
        adminId: 'admin-1',
        targetUserId: 'target',
        reason: 'Motivo',
        resourceIds: { userId: 'target' },
      }),
    );

    const payload = auditService.record.mock.calls[0][1];
    expect(payload.changes).toEqual({
      status: { before: UserStatus.ACTIVE, after: UserStatus.INACTIVE },
      deactivatedAt: {
        before: null,
        after: expect.any(String),
      },
      deactivatedBy: {
        before: null,
        after: 'admin-1',
      },
      deactivationReason: {
        before: null,
        after: 'Motivo',
      },
    });
    expect(payload.changes).not.toHaveProperty('password');
    expect(result).toMatchObject({
      userId: 'target',
      status: UserStatus.INACTIVE,
      deactivatedBy: 'admin-1',
      deactivationReason: 'Motivo',
    });
  });

  it('records USER_REACTIVATED with the same manager and reactivation diff', async () => {
    manager.findOne.mockResolvedValueOnce({
      userId: 'target',
      type: 'teacher',
      status: UserStatus.INACTIVE,
      deactivatedAt: new Date('2026-10-24T00:00:00.000Z'),
      deactivatedBy: 'old-admin',
      deactivationReason: 'Motivo antigo',
      password: 'hash',
    } as any);

    const result = await service.activate('target', 'admin-1');

    expect(auditService.record).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledWith(
      manager,
      expect.objectContaining({
        action: AuditAction.USER_REACTIVATED,
        adminId: 'admin-1',
        targetUserId: 'target',
        reason: null,
        resourceIds: { userId: 'target' },
      }),
    );

    const payload = auditService.record.mock.calls[0][1];
    expect(payload.changes).toEqual({
      status: { before: UserStatus.INACTIVE, after: UserStatus.ACTIVE },
      deactivatedAt: {
        before: '2026-10-24T00:00:00.000Z',
        after: null,
      },
      deactivatedBy: {
        before: 'old-admin',
        after: null,
      },
      deactivationReason: {
        before: 'Motivo antigo',
        after: null,
      },
    });
    expect(payload.changes).not.toHaveProperty('password');
    expect(result).toMatchObject({
      userId: 'target',
      status: UserStatus.ACTIVE,
    });
  });

  it('rethrows when audit record fails inside the transaction', async () => {
    manager.findOne.mockResolvedValueOnce({
      userId: 'target',
      type: 'teacher',
      status: UserStatus.INACTIVE,
      deactivatedAt: new Date('2026-10-24T00:00:00.000Z'),
      deactivatedBy: 'old-admin',
      deactivationReason: 'Motivo antigo',
      password: 'hash',
    } as any);
    auditService.record.mockRejectedValueOnce(new Error('audit failed'));

    await expect(service.activate('target', 'admin-1')).rejects.toThrow(
      'audit failed',
    );
  });

  it('does not record audit when user is already active', async () => {
    manager.findOne.mockResolvedValueOnce({
      userId: 'target',
      type: 'teacher',
      status: UserStatus.ACTIVE,
      password: 'hash',
    } as any);

    await service.activate('target', 'admin-1');

    expect(auditService.record).not.toHaveBeenCalled();
  });
});
