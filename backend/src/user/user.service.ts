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

  async update(userId: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers'],
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Atualiza campos básicos
    if (updateUserDto.name) user.name = updateUserDto.name.trim();
    if (updateUserDto.email)
      user.email = updateUserDto.email.trim().toLowerCase();
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.save(user);

    // Atualiza registro de estudante
    if (
      user.students &&
      user.students.length > 0 &&
      updateUserDto.registrationStudent
    ) {
      const student = user.students[0];
      student.registrationStudent = updateUserDto.registrationStudent.trim();
      await this.studentRepository.save(student);
    }

    // Atualiza registro de professor
    if (
      user.teachers &&
      user.teachers.length > 0 &&
      updateUserDto.registrationTeacher
    ) {
      const teacher = user.teachers[0];
      teacher.registrationTeacher = updateUserDto.registrationTeacher.trim();
      await this.teacherRepository.save(teacher);
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }
}
