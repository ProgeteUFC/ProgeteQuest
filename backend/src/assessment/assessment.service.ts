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
}
