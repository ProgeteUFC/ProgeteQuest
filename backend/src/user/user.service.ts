import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
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
    // Verifica o tipo de usuário
    if (createUserDto.type !== 'student' && createUserDto.type !== 'teacher') {
      throw new BadRequestException('Tipo de usuário inválido');
    }

    // Verifica se o email já está em uso
    const email = createUserDto.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email já está em uso.');
    }

    // Validação antecipada da matrícula com verificação cruzada
    if (createUserDto.type === 'student') {
      const reg = createUserDto.registrationStudent?.trim();

      if (!reg) {
        throw new BadRequestException('registrationStudent é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationStudent deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });
      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      if (existingStudent || existingTeacher) {
        throw new BadRequestException(
          'Essa matrícula já está em uso por outro usuário',
        );
      }
    } else if (createUserDto.type === 'teacher') {
      const reg = createUserDto.registrationTeacher?.trim();

      if (!reg) {
        throw new BadRequestException('registrationTeacher é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationTeacher deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });
      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      if (existingTeacher || existingStudent) {
        throw new BadRequestException(
          'Essa matrícula já está em uso por outro usuário',
        );
      }
    }

    // Criação e salvamento do usuário
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      userId: generateUuid(),
      name: createUserDto.name.trim(),
      email,
      password: hashedPassword,
      type: createUserDto.type,
    });

    await this.userRepository.save(user);

    // Criação do vínculo com estudante ou professor
    if (createUserDto.type === 'student') {
      await this.studentRepository.save({
        userId: user.userId,
        registrationStudent: createUserDto.registrationStudent?.trim(),
        user,
      });
    } else if (createUserDto.type === 'teacher') {
      await this.teacherRepository.save({
        userId: user.userId,
        registrationTeacher: createUserDto.registrationTeacher?.trim(),
        user,
      });
    }

    // Retorno dos dados públicos
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: ['userId', 'name', 'email', 'createdAt', 'updatedAt'],
      relations: ['students', 'teachers'],
    });

    return users.map((user) => {
      let type: 'student' | 'teacher' | null = null;
      if (user.students && user.students.length > 0) {
        type = 'student';
      } else if (user.teachers && user.teachers.length > 0) {
        type = 'teacher';
      }
      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        type,
      };
    });
  }

  async remove(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers'],
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Remove registros de estudante, se existirem
    if (user.students && user.students.length > 0) {
      await this.studentRepository.delete({ userId });
    }

    // Remove registros de professor, se existirem
    if (user.teachers && user.teachers.length > 0) {
      await this.teacherRepository.delete({ userId });
    }

    // Remove o usuário
    await this.userRepository.delete({ userId });

    return { message: 'Usuário removido com sucesso' };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers'],
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Só permite atualizar name, email e password
    if (updateUserDto.email) {
      const email = updateUserDto.email.trim().toLowerCase();
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser && existingUser.userId !== userId) {
        throw new BadRequestException('Email já está em uso.');
      }
      user.email = email;
    }
    if (updateUserDto.name) user.name = updateUserDto.name.trim();
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.save(user);

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }
}
