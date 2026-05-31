import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  type: string;
  isAdmin?: boolean;
}

export const User = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<UserPayload> => {
    const req = ctx.switchToHttp().getRequest();
    const authHeader: string | undefined = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token não informado');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
      const decoded = await jwtService.verifyAsync<{ user: UserPayload }>(
        token,
      );
      return decoded.user;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  },
);
