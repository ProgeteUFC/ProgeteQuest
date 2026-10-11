import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({ compare: jest.fn(async () => true) }));

describe('User deletion safety', () => {
  const manager = {
    query: jest.fn(),
    findOne: jest.fn(async () => ({ userId: 'target', type: 'teacher' })),
    delete: jest.fn(),
  };
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
  );

  beforeEach(() => jest.clearAllMocks());

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
});
