import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { generateUuid } from '../utils/generateUuid';
import { BadRequestException } from '@nestjs/common';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //Verifica o tipo de usuário
    if (createUserDto.type !== 'student' && createUserDto.type !== 'teacher') {
      throw new BadRequestException('Tipo de usuário inválido');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      userId: generateUuid(),
      name: createUserDto.name.trim(),
      email: createUserDto.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Cria o registro de estudante ou professor
    if (createUserDto.type === 'student') {
      if (!createUserDto.registrationStudent) {
        throw new BadRequestException('registrationStudent é obrigatório');
      }
      await this.studentRepository.save({
        userId: user.userId,
        registrationStudent: createUserDto.registrationStudent.trim(),
        user,
      });
    } else if (createUserDto.type === 'teacher') {
      if (!createUserDto.registrationTeacher) {
        throw new BadRequestException('registrationTeacher é obrigatório');
      }
      await this.teacherRepository.save({
        userId: user.userId,
        registrationTeacher: createUserDto.registrationTeacher.trim(),
        user,
      });
    }

    // Retornará apenas dados não sensíveis
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }
}
