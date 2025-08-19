import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dtos/createClass.dto';
import { generateUuid } from '../utils/generateUuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { validate as isUuid } from 'uuid';
import { generateJoinCode } from '../utils/generateJoinCode';
import { Student } from 'src/student/entities/student.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,
  ) {}

  async getAllClasses(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async createClass(newClass: CreateClassDto): Promise<Class> {
    // valida o UUID
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID gerado inválido');
    }

    const joinCode = generateJoinCode(10);

    // verifica se teacher existe
    const teacherEntity = await this.teacherRepository.findOneBy({
      userId: newClass.teacherId,
    });
    if (!teacherEntity) {
      throw new NotFoundException(
        `Professor com ID ${newClass.teacherId} não encontrado`,
      );
    }

    // cria uma nova turma
    const classEntity = this.classRepository.create({
      classId: id,
      teacherId: newClass.teacherId,
      name: newClass.name.trim(),
      joinCode,
    });

    return this.classRepository.save(classEntity);
  }

  async regenerateJoinCode(classId: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { classId },
    });
    if (!classEntity) throw new NotFoundException('Turma não encontrada');

    classEntity.joinCode = generateJoinCode(10);
    return this.classRepository.save(classEntity);
  }

  async enrollStudentByRegistration(
    registrationStudent: string,
    joinCode: string,
  ) {
    // Busca o aluno pela matrícula
    const student = await this.studentClassRepository.manager.findOne(Student, {
      where: { registrationStudent },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Busca a turma pelo código
    const classEntity = await this.classRepository.findOne({
      where: { joinCode },
    });
    if (!classEntity) throw new NotFoundException('Código de turma inválido');

    // Verifica se já está vinculado
    const exists = await this.studentClassRepository.findOne({
      where: { studentId: student.userId, classId: classEntity.classId },
    });
    if (exists) throw new BadRequestException('Aluno já está na turma');

    const studentClass = this.studentClassRepository.create({
      studentClassId: generateUuid(),
      studentId: student.userId,
      classId: classEntity.classId,
    });
    return this.studentClassRepository.save(studentClass);
  }

  async joinClassByCode(studentId: string, joinCode: string) {
    // Busca a turma pelo código
    const classEntity = await this.classRepository.findOne({
      where: { joinCode },
    });
    if (!classEntity) throw new NotFoundException('Código de turma inválido');

    // Busca o estudante pelo userId
    const student = await this.studentClassRepository.manager.findOne(Student, {
      where: { userId: studentId },
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Verifica se já está vinculado
    const exists = await this.studentClassRepository.findOne({
      where: { studentId: studentId, classId: classEntity.classId },
    });

    if (exists) throw new BadRequestException('Aluno já está na turma');

    const studentClass = this.studentClassRepository.create({
      studentClassId: generateUuid(),
      studentId,
      classId: classEntity.classId,
    });
    return this.studentClassRepository.save(studentClass);
  }
}
