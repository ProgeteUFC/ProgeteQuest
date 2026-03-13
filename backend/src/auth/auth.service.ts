import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

const loginAttempts: Record<string, { count: number; lastAttempt: number }> =
  {};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    // Controle de tentativas
    const now = Date.now();
    const attempts = loginAttempts[normalizedEmail] || {
      count: 0,
      lastAttempt: now,
    };
    if (attempts.count >= 5 && now - attempts.lastAttempt < 1 * 60 * 1000) {
      throw new BadRequestException(
        'Muitas tentativas. Tente novamente em 1 minuto.',
      );
    }

    // Busca o usuário usando o e-mail normalizado
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (!user) {
      // Atualiza tentativas
      loginAttempts[normalizedEmail] = {
        count: attempts.count + 1,
        lastAttempt: now,
      };
      throw new UnauthorizedException('Não existe cadastro com esse e-mail.');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      // Atualiza tentativas
      loginAttempts[normalizedEmail] = {
        count: attempts.count + 1,
        lastAttempt: now,
      };
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Reset tentativas ao logar com sucesso
    loginAttempts[normalizedEmail] = { count: 0, lastAttempt: now };

    let role = 'user';
    const student = await this.userRepository.manager.findOne('Student', {
      where: { user: { userId: user.userId } },
    });
    const teacher = await this.userRepository.manager.findOne('Teacher', {
      where: { user: { userId: user.userId } },
    });

    if (student) {
      role = 'student';
    } else if (teacher) {
      role = 'teacher';
    } else {
      throw new UnauthorizedException(
        'Usuário não possui perfil de estudante ou professor',
      );
    }

    const payload = {
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        type: role,
      },
    };

    const token = this.jwtService.sign(payload);
    return {
      token: token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        type: role,
      },
    };
  }
}
