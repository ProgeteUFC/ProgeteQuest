import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dtos/createActivity.dto';
import { generateUuid } from '../utils/generateUuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityType } from '../Enums/activity.enum';
import { validate as isUuid } from 'uuid';
import { Class } from 'src/class/entities/class.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
  ) {}

  async getAllActivities(): Promise<Activity[]> {
    return this.activityRepository.find();
  }

  async createActivity(newActivity: CreateActivityDto): Promise<Activity> {
    // tipo da atividade
    const validTypes = Object.values(ActivityType);
    if (!validTypes.includes(newActivity.type)) {
      throw new BadRequestException(`Tipo inválido: ${newActivity.type}`);
    }

    // data
    const date = new Date(newActivity.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data inválida');
    }

    // valida o UUID
    const id = generateUuid();
    if (!isUuid(id)) {
      throw new BadRequestException('ID inválido gerado');
    }

    // verifica se class existe
    const classEntity = await this.classRepository.findOneBy({
      classId: newActivity.classId,
    });
    if (!classEntity) {
      throw new NotFoundException(
        `Turma com ID ${newActivity.classId} não encontrada`,
      );
    }

    // verifica se assentement existe
    const assessmentEntity = await this.assessmentRepository.findOneBy({
      assessmentId: newActivity.assessmentId,
    });
    if (!assessmentEntity) {
      throw new NotFoundException(
        `Avaliação com ID ${newActivity.assessmentId} não encontrada`,
      );
    }

    // cria a atividade
    const activity = this.activityRepository.create({
      activityId: id,
      name: newActivity.name.trim(),
      date,
      type: newActivity.type,
      classId: newActivity.classId,
      assessmentId: newActivity.assessmentId,
    });

    return this.activityRepository.save(activity);
  }
}
