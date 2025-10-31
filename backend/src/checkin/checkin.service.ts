import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
    // Verifica se o código existe, está ativo e válido
    const code = await this.codeRepository.findOne({
      where: { codeId: dto.codeId, active: true },
    });
    if (!code) throw new NotFoundException('Código inválido ou inativo');

    // Confirma que o código pertence à atividade informada
    if (code.activityId !== dto.activityId) {
      throw new BadRequestException('Código não pertence a essa atividade');
    }

    // Verifica se a atividade existe
    const activity = await this.activityRepository.findOne({
      where: { activityId: dto.activityId },
    });
    if (!activity) throw new NotFoundException('Atividade não encontrada');

    // Verifica se o aluno está matriculado na turma da atividade
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId: dto.studentId, classId: activity.classId },
    });
    if (!studentClass)
      throw new BadRequestException('Aluno não está matriculado na turma');

    // Verifica se já fez check-in nessa atividade
    const alreadyChecked = await this.checkinRepository.findOne({
      where: { activityId: dto.activityId, studentId: dto.studentId },
    });
    if (alreadyChecked)
      throw new BadRequestException(
        'Check-in já realizado para esta atividade',
      );

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
