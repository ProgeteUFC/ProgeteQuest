import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin } from './entities/checkin.entity';
import { CreateCheckinDto } from './dtos/createCheckin.dto';
import { Activity } from 'src/activity/entities/activity.entity';
import { Code } from 'src/code/entities/code.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { generateUuid } from 'src/utils/generateUuid';

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepository: Repository<Checkin>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>,
  ) {}

  async createCheckin(dto: CreateCheckinDto) {
    const now = new Date();

    // Verifica se o código existe e é válido (ativo e data)
    const code = await this.codeRepository.findOne({
      where: { codeId: dto.codeId },
    });

    if (!code) {
      throw new NotFoundException('Código não encontrado');
    }
    if (!code.active) {
      throw new BadRequestException('Código inativo');
    }

    // Verifica a data de validade do código
    const validityDate = new Date(code.validity);
    if (now > validityDate) {
      throw new BadRequestException('Código expirado');
    }

    // Confirma que o código pertence à atividade
    if (code.activityId !== dto.activityId) {
      throw new BadRequestException('Código não pertence a essa atividade');
    }

    // Verifica se a atividade já terminou
    const activity = await this.activityRepository.findOne({
      where: { activityId: dto.activityId },
    });
    if (!activity) {
      throw new NotFoundException('Atividade não encontrada');
    }

    //Verifica se a data/hora da atividade já passou
    const activityDate = new Date(activity.date);
    if (now > activityDate) {
      throw new BadRequestException('Esta atividade já foi encerrada');
    }

    const alreadyChecked = await this.checkinRepository.findOne({
      where: { activityId: dto.activityId, studentId: dto.studentId },
    });
    if (alreadyChecked)
      // MODIFICADO: Troca BadRequest por Conflict
      throw new ConflictException('Check-in já realizado para esta atividade');

    // Validação Bônus (Já existia): Verifica se o aluno está matriculado
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId: dto.studentId, classId: activity.classId },
    });
    if (!studentClass)
      throw new BadRequestException('Aluno não está matriculado na turma');

    // Cria o check-in
    const checkin = this.checkinRepository.create({
      checkinId: generateUuid(),
      activityId: dto.activityId,
      studentId: dto.studentId,
      codeId: dto.codeId,
    });
    return this.checkinRepository.save(checkin);
  }
}
