import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { generateUuid } from 'src/utils/generateUuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // async create(body: { userId: string; registrationStudent: string }) {
  //   const { userId, registrationStudent } = body;

  //   // Verifica se o usuário existe
  //   const user = await this.userRepository.findOne({ where: { userId } });
  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado');
  //   }

  //   // Verifica se já existe um estudante com esse userId
  //   const existingStudent = await this.studentRepository.findOne({
  //     where: { userId },
  //   });
  //   if (existingStudent) {
  //     throw new BadRequestException(
  //       'Estudante já cadastrado para este usuário',
  //     );
  //   }

  //   // Cria o estudante
  //   const student = this.studentRepository.create({
  //     userId,
  //     registrationStudent: registrationStudent.trim(),
  //     user,
  //   });

  //   await this.studentRepository.save(student);

  //   return {
  //     userId: student.userId,
  //     registrationStudent: student.registrationStudent,
  //     createdAt: student.createdAt,
  //   };
  // }
}
