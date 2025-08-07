import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { CreateAssessmentDto } from './dtos/createAssessment.dto';
import { generateUuid } from '../utils/generateUuid';
import { validate as isUuid } from 'uuid';
import { Class } from 'src/class/entities/class.entity';
import { UpdateAssessmentDto } from './dtos/updateAssessment.dto';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  getAllAssessments(): Promise<Assessment[]> {
    return this.assessmentRepository.find();
  }

  async createAssessment(
    newAssessment: CreateAssessmentDto,
  ): Promise<Assessment> {
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID inválido gerado');
    }

    // Verifica turma existente
    const classEntity = await this.classRepository.findOneBy({
      classId: newAssessment.classId,
    });
    if (!classEntity) {
      throw new NotFoundException(
        `Turma com ID ${newAssessment.classId} não encontrada`,
      );
    }

    // Cria avaliação
    const assessment = this.assessmentRepository.create({
      assessmentId: id,
      name: newAssessment.name.trim(),
      classId: newAssessment.classId,
    });

    return this.assessmentRepository.save(assessment);
  }

  async updateAssessment(
    id: string,
    updateDto: UpdateAssessmentDto,
  ): Promise<Assessment> {
    const existing = await this.assessmentRepository.findOne({
      where: { assessmentId: id },
    });

    if (!existing) {
      throw new NotFoundException(`Avaliação com id ${id} não encontrada`);
    }

    if (updateDto.name !== undefined) {
      if (typeof updateDto.name !== 'string' || updateDto.name.trim() === '') {
        throw new BadRequestException('O campo "name" não pode ser vazio.');
      }
      existing.name = updateDto.name;
    }

    if (updateDto.classId !== undefined) {
      const classExists = await this.classRepository.findOne({
        where: { classId: updateDto.classId },
      });
      if (!classExists) {
        throw new NotFoundException(
          `Classe com id ${updateDto.classId} não encontrada`,
        );
      }
      existing.classId = updateDto.classId;
    }

    return await this.assessmentRepository.save(existing);
  }

  async deleteAssessment(id: string): Promise<void> {
    const result = await this.assessmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Avaliação com id ${id} não encontrada`);
    }
  }
}