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

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async getAllClasses(): Promise<Class[]> {
    return this.classRepository.find();
  }

  async createClass(newClass: CreateClassDto): Promise<Class> {
    // valida o UUID
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID inválido gerado');
    }

    // verifica se teacher existe
    const teacherEntity = await this.teacherRepository.findOneBy({
      userId: newClass.teacherId,
    });
    if (!teacherEntity) {
      throw new NotFoundException(
        `Professor com ID ${newClass.teacherId} não encontrado`,
      );
    }

    // cria uma turma nova
    const turma = this.classRepository.create({
      classId: id,
      teacherId: newClass.teacherId,
      name: newClass.name.trim(),
    });

    return this.classRepository.save(turma);
  }
}
