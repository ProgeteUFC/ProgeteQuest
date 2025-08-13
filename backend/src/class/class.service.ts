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
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Assessment } from '../assessment/entities/assessment.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
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
  async updateClass(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const existing = await this.classRepository.findOne({
      where: { classId: id },
    });

    if (!existing) {
      throw new NotFoundException(`Turma com id ${id} não encontrada`);
    }

    if (updateDto.name !== undefined) {
      if (typeof updateDto.name !== 'string' || updateDto.name.trim() === '') {
        throw new BadRequestException('O campo "name" não pode ser vazio.');
      }
      existing.name = updateDto.name;
    }

    if (updateDto.classId !== undefined) {
      const assessmentExists = await this.assessmentRepository.findOne({
        where: { assessmentId: updateDto.assessmentId },
      });
      if (!assessmentExists) {
        throw new NotFoundException(
          `Avaliação com id ${updateDto.assessmentId} não encontrada`,
        );
      }
      if (!isUuid(updateDto.classId)) {
        throw new BadRequestException('ID inválido fornecido');
      }
      existing.classId = updateDto.classId;
    }

    return await this.classRepository.save(existing);
  }

  async deleteClass(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Turma com id ${id} não encontrada`);
    }
  }
}
