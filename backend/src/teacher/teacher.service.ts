import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // async create(body: { userId: string; registrationTeacher: string }) {
  //   const { userId, registrationTeacher } = body;

  //   // Verifica se o usuário existe
  //   const user = await this.userRepository.findOne({ where: { userId } });
  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado');
  //   }

  //   const teacher = await this.teacherRepository.save({
  //     userId: userId,
  //     registrationTeacher: registrationTeacher.trim(),
  //   });

  //   console.log('Teacher created:', teacher);

  //   return {
  //     userId: teacher.userId,
  //     registrationTeacher: teacher.registrationTeacher,
  //     createdAt: teacher.createdAt,
  //   };
  // }
}
