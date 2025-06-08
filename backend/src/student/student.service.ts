import { Inject, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dtos/createStudent.dto';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { generateUuid } from 'src/utils/generateUuid';
import e from 'express';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    createStudentDto.email = createStudentDto.email.trim().toLowerCase();
    createStudentDto.name = createStudentDto.name.trim();
    createStudentDto.password = createStudentDto.password.trim();
    createStudentDto.registrationStudent =
      createStudentDto.registrationStudent.trim();

    // const savedStudent = await this.student
    const savedUser = await this.userRepository.save({
      ...createStudentDto,
      userId: generateUuid(),
    });

    const savedStudent = await this.studentRepository.save({
      userId: savedUser.userId,
      registrationStudent: createStudentDto.registrationStudent,
    });

    return {
      name: createStudentDto.name,
      email: createStudentDto.email,
      registrationStudent: createStudentDto.registrationStudent,
      userId: savedStudent.userId,
    };
  }
}
