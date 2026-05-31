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

    if (!token) {
      return false;
    }

    const loginPayload:
      | {
          user: {
            userId: number | string;
            email: string;
            name: string;
            type: string;
          };
        }
      | undefined = await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      .catch((err) => {
        console.error('Erro de validação JWT:', err);
        throw err;
      });

    if (!loginPayload) {
      return false;
    }
    if (loginPayload.user.type === 'admin') {
      return true;
    }

    return requiredRoles.some((role) => role === loginPayload.user.type);
  }
}