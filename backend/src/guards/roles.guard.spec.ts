import { RolesGuard } from './roles.guard';
import { UserStatus } from '../Enums/user.enum';

describe('RolesGuard session status', () => {
  it.each(['admin', 'teacher', 'student'])(
    'blocks inactive %s even with a valid token',
    async (type) => {
      const request = { headers: { authorization: 'Bearer token' } };
      const guard = new RolesGuard(
        { getAllAndOverride: jest.fn(() => undefined) } as never,
        {
          verifyAsync: jest.fn(async () => ({ user: { userId: 'actor' } })),
        } as never,
        {
          findOne: jest.fn(async () => ({
            userId: 'actor',
            type,
            status: UserStatus.INACTIVE,
          })),
        } as never,
      );
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({ getRequest: () => request }),
      };
      await expect(guard.canActivate(context as never)).resolves.toBe(false);
      expect(request).not.toHaveProperty('user');
    },
  );
});
