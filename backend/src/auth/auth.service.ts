import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Senha inválida');

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
    };
  }
}
