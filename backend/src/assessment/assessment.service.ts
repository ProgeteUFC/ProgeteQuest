import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { CreateAssessmentDto } from './dtos/createAssessment.dto';
import { generateUuid } from '../utils/generateUuid';
import { validate as isUuid } from 'uuid';
import { Class } from 'src/class/entities/class.entity';
import { UpdateAssessmentDto } from './dtos/updateAssessment.dto';
import { UserPayload } from 'src/decorators/user.decorator';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getAllAssessments(user: UserPayload): Promise<Assessment[]> {
    if (user.isAdmin) {
      return this.assessmentRepository.find();
    }

    const myClasses = await this.classRepository.find({
      where: { teacherId: user.userId },
      select: ['classId'],
    });

    const classIds = myClasses.map((c) => c.classId);

    if (classIds.length === 0) return [];

    return this.assessmentRepository.find({
      where: { classId: In(classIds) },
    });
  }

  async createAssessment(
    newAssessment: CreateAssessmentDto,
    user: UserPayload,
  ): Promise<Assessment> {
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID inválido gerado');
    }

    const classEntity = await this.classRepository.findOneBy({
      classId: newAssessment.classId,
    });
    if (!classEntity) {
      throw new NotFoundException(
        `Turma com ID ${newAssessment.classId} não encontrada`,
      );
    }

    if (!user.isAdmin && classEntity.teacherId !== user.userId) {
      throw new NotFoundException(
        `Turma com ID ${newAssessment.classId} não encontrada ou acesso negado`,
      );
    }

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
    user: UserPayload,
  ): Promise<Assessment> {
    const existing = await this.assessmentRepository.findOne({
      where: { assessmentId: id },
    });

    if (!existing) {
      throw new NotFoundException(`Avaliação com id ${id} não encontrada`);
    }

    if (!user.isAdmin) {
      const classEntity = await this.classRepository.findOne({
        where: { classId: existing.classId, teacherId: user.userId },
      });
      if (!classEntity) {
        throw new NotFoundException(
          `Avaliação com id ${id} não encontrada ou acesso negado`,
        );
      }
    }

    if (updateDto.name !== undefined) {
      if (typeof updateDto.name !== 'string' || updateDto.name.trim() === '') {
        throw new BadRequestException('O campo "name" não pode ser vazio.');
      }
      existing.name = updateDto.name;
    }

    if (updateDto.classId !== undefined) {
      const classExists = await this.classRepository.findOne({
        where: user.isAdmin
          ? { classId: updateDto.classId }
          : { classId: updateDto.classId, teacherId: user.userId },
      });
      if (!classExists) {
        throw new NotFoundException(
          `Classe com id ${updateDto.classId} não encontrada ou acesso negado`,
        );
      }
      existing.classId = updateDto.classId;
    }

    return await this.assessmentRepository.save(existing);
  }

  async deleteAssessment(id: string, user: UserPayload): Promise<void> {
    const existing = await this.assessmentRepository.findOne({
      where: { assessmentId: id },
    });

    if (!existing) {
      throw new NotFoundException(`Avaliação com id ${id} não encontrada`);
    }

    if (!user.isAdmin) {
      const classEntity = await this.classRepository.findOne({
        where: { classId: existing.classId, teacherId: user.userId },
      });
      if (!classEntity) {
        throw new NotFoundException(
          `Avaliação com id ${id} não encontrada ou acesso negado`,
        );
      }
    }

    const result = await this.assessmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Avaliação com id ${id} não encontrada`);
    }
  }
}
