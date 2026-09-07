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
import { UserPayload } from 'src/decorators/user.decorator';

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

  async createCheckin(dto: CreateCheckinDto, user: UserPayload) {
    const now = new Date();
    const studentId = user.isAdmin && dto.studentId ? dto.studentId : user.userId;

    // Verifica se o código existe e é válido (ativo e data)
    const code = await this.codeRepository.findOne({
      where: dto.codeId
        ? { codeId: dto.codeId, activityId: dto.activityId }
        : { code: dto.code.trim(), activityId: dto.activityId },
    });

    if (!code) {
      throw new NotFoundException('Código não encontrado');
    }
    
    // Admin ignora se o código já foi desativado
    if (!user.isAdmin && !code.active) {
      throw new BadRequestException('Código inativo');
    }

    // Verifica a data de validade do código (Admin ignora expiração)
    const validityDate = new Date(code.validity);
    if (!user.isAdmin && now > validityDate) {
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

    // Verifica se a data/hora da atividade já passou (Admin ignora)
    const activityDate = new Date(activity.date);
    if (!user.isAdmin && now > activityDate) {
      throw new BadRequestException('Esta atividade já foi encerrada');
    }

    const alreadyChecked = await this.checkinRepository.findOne({
      where: { activityId: dto.activityId, studentId },
    });
    if (alreadyChecked)
      // MODIFICADO: Troca BadRequest por Conflict
      throw new ConflictException('Check-in já realizado para esta atividade');

    // Validação Bônus (Já existia): Verifica se o aluno está matriculado (Admin ignora)
    const studentClass = await this.studentClassRepository.findOne({
      where: { studentId, classId: activity.classId },
    });
    if (!user.isAdmin && !studentClass)
      throw new BadRequestException('Aluno não está matriculado na turma');

    // Cria o check-in
    const checkin = this.checkinRepository.create({
      checkinId: generateUuid(),
      activityId: dto.activityId,
      studentId,
      codeId: code.codeId,
    });
    return this.checkinRepository.save(checkin);
  }

  async listByActivity(activityId: string, user: UserPayload) {
    const activity = await this.activityRepository.findOne({
      where: { activityId },
      relations: ['class'],
    });
    if (!activity || (!user.isAdmin && activity.class.teacherId !== user.userId)) {
      throw new NotFoundException('Atividade não encontrada ou acesso negado');
    }

    const checkins = await this.checkinRepository.find({
      where: { activityId },
      relations: ['student', 'student.user'],
      order: { createdAt: 'ASC' },
    });

    return checkins.map((checkin) => ({
      checkinId: checkin.checkinId,
      studentId: checkin.studentId,
      name: checkin.student.user?.name,
      registrationStudent: checkin.student.registrationStudent,
      deliveredAt: checkin.createdAt,
    }));
  }
}
