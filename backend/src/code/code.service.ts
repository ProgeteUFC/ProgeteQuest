import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Code } from './entities/code.entity';
import { CreateCodeDto } from './dtos/createCode.dto';
import { generateUuid } from 'src/utils/generateUuid';
import { generateJoinCode } from 'src/utils/generateJoinCode';
import { Activity } from 'src/activity/entities/activity.entity';
import { Class } from 'src/class/entities/class.entity';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async createCode(dto: CreateCodeDto) {
    const code = this.codeRepository.create({
      codeId: generateUuid(),
      code: generateJoinCode(10),
      validity: dto.validity,
      active: true,
      score: dto.score,
      activityId: dto.activityId,
    });
    return this.codeRepository.save(code);
  }

  async invalidateCode(id: string) {
    const code = await this.codeRepository.findOne({ where: { codeId: id } });
    if (!code) throw new NotFoundException('Código não encontrado');
    code.active = false;
    return this.codeRepository.save(code);
  }

  async renewCode(id: string, teacherId?: string) {
    const code = await this.codeRepository.findOne({ where: { codeId: id } });
    if (!code) throw new NotFoundException('Código não encontrado');

    // Confirma atividade e turma/professor
    const activity = await this.activityRepository.findOne({
      where: { activityId: code.activityId },
    });
    if (!activity) throw new NotFoundException('Atividade não encontrada');

    const classEntity = await this.classRepository.findOne({
      where: { classId: activity.classId },
    });
    if (!classEntity) throw new NotFoundException('Turma não encontrada');

    if (teacherId && classEntity.teacherId !== teacherId) {
      throw new BadRequestException('Código não pertence ao professor logado');
    }

    // Invalida o código antigo
    code.active = false;
    await this.codeRepository.save(code);

    // Cria um novo código (mantendo validade/score/activity)
    const newCode = this.codeRepository.create({
      codeId: generateUuid(),
      code: generateJoinCode(10),
      validity: code.validity,
      active: true,
      score: code.score,
      activityId: code.activityId,
    });
    return this.codeRepository.save(newCode);
  }

  async listCodesByActivity(activityId: string) {
    return this.codeRepository.find({ where: { activityId } });
  }
}
