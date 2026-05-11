import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;
    const token = authorization?.replace('Bearer ', '');

    const loginPayload:
      | {
          user: {
            userId: number;
            email: string;
            name: string;
            type: string;
            isAdmin?: boolean;
          };
        }
      | undefined = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      .catch(err => {
        console.error("Erro ao buscar atividades:", err);
        throw err;
      });

    if (!loginPayload) {
      return false;
    }

    return loginPayload.user.isAdmin === true || requiredRoles.some((role) => role === loginPayload.user.type);
  }
}
