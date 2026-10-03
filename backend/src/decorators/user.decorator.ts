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
    
    // Se o RolesGuard já anexou o usuário apoiado pelo banco de dados ao `req.user`, prefira-o.
    if (req && req.user && typeof req.user === 'object') {
      const u = req.user as UserPayload;
      if (!u.userId) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }
      return u;
    }

    // Fallback: quando a guarda não foi executada (por exemplo, uso direto do decorador), decodifique o JWT.
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
