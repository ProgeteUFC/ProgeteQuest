import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { Class } from 'src/class/entities/class.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Forum } from 'src/forum/entities/forum.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import { AUDIT_TRAIL, AuditTrail } from 'src/common/audit/audit-trail';
import { TransferClassesDto } from './dtos/transfer-classes.dto';
import {
  PreservedRelationsDto,
  TransferClassesResponseDto,
} from './dtos/responses/transfer-classes.response.dto';

@Injectable()
export class TeacherTransferService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(AUDIT_TRAIL) private readonly auditTrail: AuditTrail,
  ) {}

  /**
   * Troca o professor responsável por um conjunto de turmas.
   *
   * Matrículas, avaliações, atividades e fóruns apontam para a turma, não para
   * o professor: mover a turma de dono é alterar `class.teacher_id` e nada
   * mais. Nenhum registro acadêmico é apagado ou recriado — e a conferência
   * depois do UPDATE existe para que isso deixe de ser promessa e passe a ser
   * condição de confirmação da transação.
   */
  async transferClasses(
    sourceTeacherId: string,
    dto: TransferClassesDto,
    adminId: string,
  ): Promise<TransferClassesResponseDto> {
    const { destinationTeacherId, classIds } = dto;

    if (sourceTeacherId === destinationTeacherId) {
      throw new BadRequestException(
        'O professor de destino deve ser diferente do professor de origem',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      // Trava os dois professores de uma vez e em ordem de ID: duas
      // transferências cruzadas (A→B e B→A simultâneas) pegam as linhas na
      // mesma sequência e não travam uma na outra.
      await manager.find(User, {
        where: { userId: In([sourceTeacherId, destinationTeacherId]) },
        order: { userId: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });

      await this.loadTeacher(manager, sourceTeacherId, 'origem');
      const destination = await this.loadTeacher(
        manager,
        destinationTeacherId,
        'destino',
      );

      if (destination.status !== UserStatus.ACTIVE) {
        throw new BadRequestException(
          'O professor de destino está inativo e não pode receber turmas',
        );
      }

      const classes = await this.loadOwnedClasses(
        manager,
        sourceTeacherId,
        classIds,
      );

      const before = await this.countAcademicRecords(manager, classIds);

      await manager.update(
        Class,
        { classId: In(classIds) },
        { teacherId: destinationTeacherId },
      );

      const after = await this.countAcademicRecords(manager, classIds);
      this.assertNothingWasLost(before, after);

      const transferredAt = new Date();

      await this.auditTrail.record(
        {
          action: 'teacher.classes.transferred',
          actorId: adminId,
          entity: 'teacher',
          entityId: sourceTeacherId,
          occurredAt: transferredAt,
          details: {
            sourceTeacherId,
            destinationTeacherId,
            classIds: classes.map((turma) => turma.classId),
            preservedRelations: after,
          },
        },
        manager,
      );

      return {
        sourceTeacherId,
        destinationTeacherId,
        transferredClasses: classes.map((turma) => ({
          classId: turma.classId,
          name: turma.name,
        })),
        preservedRelations: after,
        transferredAt,
      };
    });
  }

  /**
   * Garante que o ID corresponde a um usuário com perfil de professor. A linha
   * do usuário já está travada pela transação. O `papel` entra na mensagem
   * para o administrador saber qual das duas pontas está errada.
   */
  private async loadTeacher(
    manager: EntityManager,
    userId: string,
    papel: 'origem' | 'destino',
  ): Promise<User> {
    const user = await manager.findOne(User, { where: { userId } });

    if (!user) {
      throw new NotFoundException(`Professor de ${papel} não encontrado`);
    }

    const profile = await manager.findOne(Teacher, { where: { userId } });

    if (user.type !== UserType.TEACHER || !profile) {
      throw new BadRequestException(
        `O usuário de ${papel} não possui perfil de professor`,
      );
    }

    return user;
  }

  /**
   * Trava as turmas na ordem dos IDs — duas transferências simultâneas pegam
   * os mesmos registros sempre na mesma sequência, sem deadlock — e recusa a
   * operação inteira se alguma turma não existir ou for de outro professor.
   */
  private async loadOwnedClasses(
    manager: EntityManager,
    sourceTeacherId: string,
    classIds: string[],
  ): Promise<Class[]> {
    const classes = await manager.find(Class, {
      where: { classId: In(classIds) },
      order: { classId: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });

    const encontradas = new Set(classes.map((turma) => turma.classId));
    const inexistentes = classIds.filter((id) => !encontradas.has(id));

    if (inexistentes.length) {
      throw new NotFoundException(
        `Turmas não encontradas: ${inexistentes.join(', ')}`,
      );
    }

    const deOutroProfessor = classes.filter(
      (turma) => turma.teacherId !== sourceTeacherId,
    );

    if (deOutroProfessor.length) {
      throw new BadRequestException(
        `Turmas que não pertencem ao professor de origem: ${deOutroProfessor
          .map((turma) => turma.classId)
          .join(', ')}`,
      );
    }

    return classes;
  }

  private async countAcademicRecords(
    manager: EntityManager,
    classIds: string[],
  ): Promise<PreservedRelationsDto> {
    const [enrollments, assessments, activities, forums] = await Promise.all([
      manager.countBy(StudentClass, { classId: In(classIds) }),
      manager.countBy(Assessment, { classId: In(classIds) }),
      manager.countBy(Activity, { classId: In(classIds) }),
      manager.countBy(Forum, { turmaId: In(classIds) }),
    ]);

    return { enrollments, assessments, activities, forums };
  }

  /**
   * Rede de segurança do requisito "nenhuma informação acadêmica é excluída":
   * qualquer divergência derruba a transação e devolve as turmas ao professor
   * de origem.
   */
  private assertNothingWasLost(
    before: PreservedRelationsDto,
    after: PreservedRelationsDto,
  ): void {
    const perdas = (
      Object.keys(before) as Array<keyof PreservedRelationsDto>
    ).filter((relacao) => after[relacao] !== before[relacao]);

    if (perdas.length) {
      throw new ConflictException(
        `A transferência alteraria vínculos acadêmicos (${perdas.join(', ')}). Nenhuma turma foi transferida.`,
      );
    }
  }
}
