import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    const loginPayload =
      (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      }).catch((err) => {
        console.error('Erro de validação JWT:', err?.message ?? err);
        return undefined;
      })) as
      | {
          user: {
            userId: number | string;
            email: string;
            name: string;
            type: string;
            isAdmin?: boolean;
          };
        }
      | undefined;

    if (!loginPayload) {
      return false;
    }

    const userId = String(loginPayload.user.userId);

    const foundUser = await this.userRepository.findOne({
      where: { userId },
      relations: ['admins', 'students', 'teachers'],
    });

    if (!foundUser) {
      return false;
    }

    // Falha fechada: requer explícito `active === true`.
    if (foundUser.active !== true) {
      return false;
    }

    // Anexa o perfil de usuário atual do banco de dados à solicitação
    const req = context.switchToHttp().getRequest();
    req.user = {
      userId: foundUser.userId,
      email: foundUser.email,
      name: foundUser.name,
      type: foundUser.type,
      isAdmin: foundUser.admins && foundUser.admins.length > 0,
    };

    if (!requiredRoles) {
      return true;
    }

    if (req.user.type === 'admin' || req.user.isAdmin === true) {
      return true;
    }

    return requiredRoles.some((role) => role === req.user.type);
  }
}
