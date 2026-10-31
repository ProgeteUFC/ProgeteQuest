import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { generateUuid } from '../utils/generateUuid';
import { Student } from 'src/student/entities/student.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Class as ClassEntity } from 'src/class/entities/class.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { Topic } from 'src/forum/entities/topic.entity';
import { Post } from 'src/forum/entities/post.entity';
import { Forum } from 'src/forum/entities/forum.entity';
import { Code } from 'src/code/entities/code.entity';
import { UserPayload } from '../decorators/user.decorator';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import * as bcrypt from 'bcrypt';
import { AuditService } from 'src/audit/audit.service';
import { buildChanges } from 'src/audit/audit-diff.util';
import { AuditAction } from 'src/Enums/audit-action.enum';

export const USER_AUDIT_ALLOWED_FIELDS = [
  'name',
  'email',
  'registrationStudent',
  'registrationTeacher',
  'type',
  'status',
  'deactivatedAt',
  'deactivatedBy',
  'deactivationReason',
] as const;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    context?: { adminId: string },
  ) {
    // Verifica o tipo de usuário
    if (
      createUserDto.type !== 'student' &&
      createUserDto.type !== 'teacher' &&
      createUserDto.type !== 'admin'
    ) {
      throw new BadRequestException('Tipo de usuário inválido');
    }

    // Verifica se o email já está em uso
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Esse registro já existe');
    }

    // Validação antecipada da matrícula com verificação cruzada
    if (createUserDto.type === 'student') {
      const reg = createUserDto.registrationStudent?.trim();

      if (!reg) {
        throw new BadRequestException('registrationStudent é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationStudent deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      if (existingStudent || existingTeacher) {
        throw new ConflictException('Esse registro já existe');
      }
    } else if (createUserDto.type === 'teacher') {
      const reg = createUserDto.registrationTeacher?.trim();

      if (!reg) {
        throw new BadRequestException('registrationTeacher é obrigatório');
      }

      if (!/^\d{6}$/.test(reg)) {
        throw new BadRequestException(
          'registrationTeacher deve conter exatamente 6 dígitos numéricos',
        );
      }

      const existingTeacher = await this.teacherRepository.findOne({
        where: { registrationTeacher: reg },
      });

      const existingStudent = await this.studentRepository.findOne({
        where: { registrationStudent: reg },
      });

      if (existingTeacher || existingStudent) {
        throw new ConflictException('Esse registro já existe');
      }
    }

    // Criação e salvamento do usuário
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // O usuário e o seu perfil nascem juntos: se o perfil falhar, o usuário
    // não fica gravado pela metade (sem perfil ele nem conseguiria logar).
    const user = await this.dataSource.transaction(async (manager) => {
      const registration =
        createUserDto.type === 'student'
          ? createUserDto.registrationStudent
          : createUserDto.type === 'teacher'
            ? createUserDto.registrationTeacher
            : undefined;
      if (registration)
        await this.assertRegistrationAvailable(
          manager,
          '',
          registration.trim(),
        );
      const novoUsuario = manager.create(User, {
        userId: generateUuid(),
        name: createUserDto.name.trim(),
        email,
        password: hashedPassword,
        type: createUserDto.type,
      });

      await manager.save(novoUsuario);

      // Criação do vínculo com estudante, professor ou admin
      if (createUserDto.type === 'student') {
        await manager.save(Student, {
          userId: novoUsuario.userId,
          registrationStudent: createUserDto.registrationStudent?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'teacher') {
        await manager.save(Teacher, {
          userId: novoUsuario.userId,
          registrationTeacher: createUserDto.registrationTeacher?.trim(),
          user: novoUsuario,
        });
      } else if (createUserDto.type === 'admin') {
        await manager.save(Admin, {
          userId: novoUsuario.userId,
          user: novoUsuario,
        });
      }

      const createdUser = await manager.findOne(User, {
        where: { userId: novoUsuario.userId },
      });

      const after: Record<string, unknown> = {
        name: createdUser?.name ?? novoUsuario.name,
        email: createdUser?.email ?? novoUsuario.email,
        type: createdUser?.type ?? novoUsuario.type,
        status: createdUser?.status ?? UserStatus.ACTIVE,
        deactivatedAt: createdUser?.deactivatedAt ?? null,
        deactivatedBy: createdUser?.deactivatedBy ?? null,
        deactivationReason: createdUser?.deactivationReason ?? null,
      };

      if (createUserDto.type === 'student') {
        const profile = await manager.findOne(Student, {
          where: { userId: novoUsuario.userId },
        });
        after.registrationStudent = profile?.registrationStudent ?? null;
      }
      if (createUserDto.type === 'teacher') {
        const profile = await manager.findOne(Teacher, {
          where: { userId: novoUsuario.userId },
        });
        after.registrationTeacher = profile?.registrationTeacher ?? null;
      }

      if (context) {
        const changes = buildChanges(null, after, USER_AUDIT_ALLOWED_FIELDS);
        await this.auditService.record(manager, {
          action: AuditAction.USER_CREATED,
          adminId: context.adminId,
          targetUserId: novoUsuario.userId,
          reason: null,
          changes,
          resourceIds: { userId: novoUsuario.userId },
        });
      }

      return {
        userId: novoUsuario.userId,
        name: novoUsuario.name,
        email: novoUsuario.email,
        type: novoUsuario.type,
      };
    });

    // Retorno dos dados públicos
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: [
        'userId',
        'name',
        'email',
        'type',
        'status',
        'createdAt',
        'updatedAt',
      ],
      relations: ['students', 'teachers', 'admins'],
    });

    return users.map((user) => ({
      userId: user.userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      type: user.type,
      status: user.status,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
    }));
  }

  async remove(userId: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Valida senha
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        // Serializa exclusões administrativas e protege a última conta ativa.
        await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['admin-user-state']);
        const locked = await manager.findOne(User, { where: { userId }, lock: { mode: 'pessimistic_write' } });
        if (!locked) throw new BadRequestException('Usuário não encontrado');
        const impact = await this.getDeletionImpact(userId, manager);
        if (!impact.canDelete) throw new ConflictException({ message: 'Usuário possui dependências e não pode ser excluído.', impact });
        if (locked.type === UserType.ADMIN && locked.status === UserStatus.ACTIVE && await manager.count(User, { where: { type: UserType.ADMIN, status: UserStatus.ACTIVE } }) <= 1) {
          throw new ConflictException('Não é possível excluir o último administrador ativo.');
        }
        await manager.delete(Admin, { userId });
        await manager.delete(Student, { userId });
        await manager.delete(Teacher, { userId });
        await manager.delete(User, { userId });
      });
    } catch (error) {
      if ((error as { driverError?: { code?: string } }).driverError?.code === '23503') throw new ConflictException('Existem dependências vinculadas ao usuário. Nenhum dado foi excluído.');
      throw error;
    }

    return { message: 'Usuário removido com sucesso' };
  }

  async update(
    userId: string,
    body: UpdateUserDto,
    context?: { adminId: string },
  ) {
    const fields = [
      'name',
      'email',
      'password',
      'registrationStudent',
      'registrationTeacher',
    ];
    if (Object.keys(body).some((key) => !fields.includes(key))) {
      throw new BadRequestException(
        'Não é permitido alterar o perfil ou enviar campos desconhecidos',
      );
    }
    const entries = Object.entries(body).filter(
      ([, value]) => value !== undefined,
    );
    if (
      !entries.length ||
      entries.some(([, value]) => typeof value !== 'string' || !value.trim())
    ) {
      throw new BadRequestException('Informe campos válidos e não vazios');
    }

    if (context && body.password !== undefined) {
      throw new BadRequestException(
        'A edição administrativa não altera a senha do usuário',
      );
    }
    
    try {
      return await this.dataSource.transaction(async (manager) => {
        // A mesma matrícula é reservada em criação e edição, inclusive entre perfis.
        const registration =
          body.registrationStudent ?? body.registrationTeacher;
        if (registration !== undefined) {
          if (!/^\d{6}$/.test(registration.trim())) {
            throw new BadRequestException(
              'Matrícula/SIAPE deve conter exatamente 6 dígitos',
            );
          }
          await this.assertRegistrationAvailable(
            manager,
            userId,
            registration.trim(),
          );
        }
        const user = await manager.findOne(User, {
          where: { userId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!user) throw new BadRequestException('Usuário não encontrado');
        if (
          body.registrationStudent !== undefined &&
          user.type !== UserType.STUDENT
        ) {
          throw new BadRequestException(
            'Matrícula de aluno não se aplica a este perfil',
          );
        }
        if (
          body.registrationTeacher !== undefined &&
          user.type !== UserType.TEACHER
        ) {
          throw new BadRequestException('SIAPE não se aplica a este perfil');
        }
        
        const before = await (async () => {
          const snapshot: Record<string, unknown> = {
            name: user.name,
            email: user.email,
            type: user.type,
            status: user.status,
            deactivatedAt: user.deactivatedAt,
            deactivatedBy: user.deactivatedBy,
            deactivationReason: user.deactivationReason,
          };

          if (user.type === UserType.STUDENT) {
            const profile = await manager.findOne(Student, { where: { userId } });
            snapshot.registrationStudent = profile?.registrationStudent ?? null;
          }
          if (user.type === UserType.TEACHER) {
            const profile = await manager.findOne(Teacher, { where: { userId } });
            snapshot.registrationTeacher = profile?.registrationTeacher ?? null;
          }

          return snapshot;
        })();

        if (body.email !== undefined) {
          const email = body.email.trim().toLowerCase();
          const existing = await manager.findOne(User, { where: { email } });
          if (existing && existing.userId !== userId) {
            throw new ConflictException('E-mail já cadastrado');
          }
          user.email = email;
        }
        if (body.name !== undefined) user.name = body.name.trim();
        if (body.password !== undefined)
          user.password = await bcrypt.hash(body.password, 10);

        if (body.registrationStudent !== undefined) {
          const profile = await manager.findOne(Student, { where: { userId } });
          if (!profile)
            throw new BadRequestException('Perfil de aluno não encontrado');
          profile.registrationStudent = body.registrationStudent.trim();
          await manager.save(Student, profile);
        }
        if (body.registrationTeacher !== undefined) {
          const profile = await manager.findOne(Teacher, { where: { userId } });
          if (!profile)
            throw new BadRequestException('Perfil de professor não encontrado');
          profile.registrationTeacher = body.registrationTeacher.trim();
          await manager.save(Teacher, profile);
        }
        await manager.save(User, user);
        
        const after = await (async () => {
          const snapshot: Record<string, unknown> = {
            name: user.name,
            email: user.email,
            type: user.type,
            status: user.status,
            deactivatedAt: user.deactivatedAt,
            deactivatedBy: user.deactivatedBy,
            deactivationReason: user.deactivationReason,
          };

          if (user.type === UserType.STUDENT) {
            const profile = await manager.findOne(Student, { where: { userId } });
            snapshot.registrationStudent = profile?.registrationStudent ?? null;
          }
          if (user.type === UserType.TEACHER) {
            const profile = await manager.findOne(Teacher, { where: { userId } });
            snapshot.registrationTeacher = profile?.registrationTeacher ?? null;
          }

          return snapshot;
        })();

        const changes = buildChanges(before, after, USER_AUDIT_ALLOWED_FIELDS);

        if (context && Object.keys(changes).length > 0) {
          await this.auditService.record(manager, {
            action: AuditAction.USER_UPDATED,
            adminId: context.adminId,
            targetUserId: user.userId,
            reason: null,
            changes,
            resourceIds: { userId: user.userId },
          });
        }

        return {
          userId: user.userId,
          name: user.name,
          email: user.email,
          type: user.type,
          status: user.status,
        };
      });
    } catch (error) {
      if (
        (error as { driverError?: { code?: string } }).driverError?.code ===
        '23505'
      ) {
        throw new ConflictException('E-mail ou matrícula/SIAPE já cadastrado');
      }
      throw error;
    }
  }

  private async assertRegistrationAvailable(
    manager: EntityManager,
    userId: string,
    registration: string,
  ) {
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      `registration:${registration}`,
    ]);
    const student = await manager.findOne(Student, {
      where: { registrationStudent: registration },
    });
    const teacher = await manager.findOne(Teacher, {
      where: { registrationTeacher: registration },
    });
    if (
      (student && student.userId !== userId) ||
      (teacher && teacher.userId !== userId)
    ) {
      throw new ConflictException('Matrícula/SIAPE já cadastrado');
    }
  }

  async findOne(userId: string, requester?: UserPayload) {
    if (requester && !requester.isAdmin && requester.userId !== userId) {
      const [access] = await this.dataSource.query(`SELECT EXISTS (
        SELECT 1 FROM class c JOIN student_class sc ON sc.class_id = c.class_id
        WHERE (c.teacher_id = $1 AND sc.student_id = $2)
           OR (c.teacher_id = $2 AND sc.student_id = $1)
      ) AS allowed`, [requester.userId, userId]);
      if (!access.allowed) throw new ForbiddenException('Usuário não pertence às suas turmas.');
    }
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers', 'admins'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      type: user.type,
      status: user.status,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneForAdmin(userId: string) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['students', 'teachers'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      type: user.type,
      status: user.status,
      registrationStudent: user.students?.[0]?.registrationStudent,
      registrationTeacher: user.teachers?.[0]?.registrationTeacher,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deactivatedAt: user.deactivatedAt,
      deactivatedBy: user.deactivatedBy,
      deactivationReason: user.deactivationReason,
    };
  }

  async getDeletionImpact(userId: string, manager?: EntityManager) {
    const source = manager ?? this.dataSource;
    const user = await (manager?.getRepository(User) ?? this.userRepository).findOne({
      where: { userId },
      select: ['userId', 'type', 'status'],
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const [
      classesAsStudent,
      classesAsTeacher,
      activities,
      assessments,
      checkins,
      forumTopics,
      forumPosts,
      enrollments,
      forums,
      codes,
    ] = await Promise.all([
      source
        .getRepository(StudentClass)
        .countBy({ studentId: userId }),
      source.getRepository(ClassEntity).countBy({ teacherId: userId }),
      source
        .getRepository(Activity)
        .count({ where: { class: { teacherId: userId } } }),
      source
        .getRepository(Assessment)
        .count({ where: { class: { teacherId: userId } } }),
      source.getRepository(Checkin).count({ where: [{ studentId: userId }, { activity: { class: { teacherId: userId } } }] }),
      source.getRepository(Topic).count({ where: [{ autorId: userId }, { forum: { turma: { teacherId: userId } } }] }),
      source.getRepository(Post).count({ where: [{ autorId: userId }, { topic: { autorId: userId } }, { topic: { forum: { turma: { teacherId: userId } } } }] }),
      source.getRepository(StudentClass).count({ where: [{ studentId: userId }, { class: { teacherId: userId } }] }),
      source.getRepository(Forum).count({ where: { turma: { teacherId: userId } } }),
      source.getRepository(Code).count({ where: { activity: { class: { teacherId: userId } } } }),
    ]);

    const hasDependencies = [classesAsStudent, classesAsTeacher, activities, assessments, checkins, forumTopics, forumPosts, enrollments, forums, codes].some((count) => count > 0);
    const lastActiveAdmin = user.type === UserType.ADMIN && user.status === UserStatus.ACTIVE && await source.getRepository(User).countBy({ type: UserType.ADMIN, status: UserStatus.ACTIVE }) <= 1;
    const blockedReasons: string[] = [];
    if (hasDependencies) blockedReasons.push('Existem vínculos ou histórico acadêmico. A exclusão está bloqueada.');
    if (lastActiveAdmin)
      blockedReasons.push(
        'Não é possível excluir o último administrador ativo.',
      );

    const impact =
      user.type === UserType.TEACHER
        ? {
            classes: classesAsTeacher,
            assessments,
            activities,
            enrollments,
            checkins,
            forums,
            topics: forumTopics,
            posts: forumPosts,
          }
        : user.type === UserType.STUDENT
          ? {
              enrollments,
              checkins,
              topics: forumTopics,
              posts: forumPosts,
            }
          : {};

    return {
      userId,
      type: user.type,
      impact,
      classesAsStudent,
      classesAsTeacher,
      activities,
      assessments,
      checkins,
      forumTopics,
      forumPosts,
      enrollments,
      forums,
      codes,
      hasDependencies,
      canDelete: blockedReasons.length === 0,
      blockedReasons,
    };
  }

  async deactivate(userId: string, adminId: string, reason: string) {
    if (typeof reason !== 'string' || !reason.trim())
      throw new BadRequestException('Informe o motivo da desativação.');
    if (userId === adminId) {
      throw new BadRequestException('Você não pode desativar a própria conta');
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        'admin-user-state',
      ]);
      const activeAdmins = await manager
        .createQueryBuilder(User, 'user')
        .setLock('pessimistic_write')
        .where('user.type = :type', { type: UserType.ADMIN })
        .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
        .orderBy('user.user_id', 'ASC')
        .getMany();

      const user = await manager.findOne(User, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      if (user.status === UserStatus.INACTIVE) {
        return {
          userId: user.userId,
          status: user.status,
          message: 'Usuário já estava inativo',
        };
      }

      if (user.type === UserType.ADMIN && activeAdmins.length <= 1) {
        throw new BadRequestException(
          'Não é possível desativar o último administrador ativo',
        );
      }

      const before = USER_AUDIT_ALLOWED_FIELDS.reduce(
        (acc, field) => {
          acc[field] = user[field];
          return acc;
        },
        {} as Record<string, unknown>,
      );
      
      user.status = UserStatus.INACTIVE;
      user.deactivatedAt = new Date();
      user.deactivatedBy = adminId;
      user.deactivationReason = reason;

      await manager.save(user);

      const after = USER_AUDIT_ALLOWED_FIELDS.reduce(
        (acc, field) => {
          acc[field] = user[field];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const changes = buildChanges(before, after, USER_AUDIT_ALLOWED_FIELDS);

      if (Object.keys(changes).length > 0) {
        await this.auditService.record(manager, {
          action: AuditAction.USER_DEACTIVATED,
          adminId,
          targetUserId: user.userId,
          reason,
          changes,
          resourceIds: { userId: user.userId },
        });
      }
      
      return {
        userId: user.userId,
        status: user.status,
        deactivatedAt: user.deactivatedAt,
        deactivatedBy: user.deactivatedBy,
        deactivationReason: user.deactivationReason,
      };
    });
  }

  async resetPassword(userId: string, newPassword: string, reason: string, adminId: string) {
    if (typeof newPassword !== 'string' || !newPassword.trim() || newPassword.length < 8 || Buffer.byteLength(newPassword, 'utf8') > 72) {
      throw new BadRequestException('A senha deve ter pelo menos 8 caracteres e no máximo 72 bytes.');
    }
    if (typeof reason !== 'string' || !reason.trim() || reason.length > 500) {
      throw new BadRequestException('Informe um motivo válido de até 500 caracteres.');
    }
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) throw new BadRequestException('Usuário não encontrado');
      user.password = await bcrypt.hash(newPassword, 10);
      await manager.save(User, user);
      await this.auditService.record(manager, {
        action: AuditAction.PASSWORD_RESET,
        adminId,
        targetUserId: userId,
        reason: reason.trim(),
        changes: { credentialsChanged: true },
        resourceIds: { userId },
      });
      return { userId, message: 'Senha redefinida com sucesso.' };
    });
  }

    async activate(userId: string, adminId: string) {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

    if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

    if (user.status === UserStatus.ACTIVE) {
        return {
          userId: user.userId,
          status: user.status,
          message: 'Usuário já estava ativo',
        };
      }

    const before = USER_AUDIT_ALLOWED_FIELDS.reduce(
        (acc, field) => {
          acc[field] = user[field];
          return acc;
        },
        {} as Record<string, unknown>,
      );

    user.status = UserStatus.ACTIVE;
    user.deactivatedAt = null;
    user.deactivatedBy = null;
    user.deactivationReason = null;

    await manager.save(user);

      const after = USER_AUDIT_ALLOWED_FIELDS.reduce(
        (acc, field) => {
          acc[field] = user[field];
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const changes = buildChanges(before, after, USER_AUDIT_ALLOWED_FIELDS);

      await this.auditService.record(manager, {
        action: AuditAction.USER_REACTIVATED,
        adminId,
        targetUserId: user.userId,
        reason: null,
        changes,
        resourceIds: { userId: user.userId },
      });

    return { userId: user.userId, status: user.status };
    });
  }
}
