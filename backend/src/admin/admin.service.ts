import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserStatus, UserType } from 'src/Enums/user.enum';
import { AdminAuditLog } from 'src/audit/entities/admin-audit-log.entity';
import { ListAuditLogsQueryDto } from 'src/audit/dtos/list-audit-logs-query.dto';
import {
  AuditLogListResponseDto,
  AuditLogResponseDto,
  AuditLogUserDto,
} from 'src/audit/dtos/audit-log.response.dto';
import { ListUsersQueryDto } from './dtos/list-users-query.dto';
import { AdminUserResponseDto } from './dtos/responses/admin-user.response.dto';
import { AdminUserListResponseDto } from './dtos/responses/admin-user-list.response.dto';

interface RawAdminUserRow {
  userId: string;
  name: string;
  email: string;
  type: UserType;
  status: UserStatus;
  registrationStudent: string | null;
  registrationTeacher: string | null;
  createdAt: Date;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AdminAuditLog)
    private readonly auditLogRepository: Repository<AdminAuditLog>,
  ) {}

  async findAuditLogs(
    query: ListAuditLogsQueryDto,
  ): Promise<AuditLogListResponseDto> {
    const { page, limit } = query;

    // Seleciona só id, nome e e-mail dos usuários: a senha nunca é carregada.
    const [logs, totalItems] = await this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoin('log.admin', 'admin')
      .addSelect(['admin.userId', 'admin.name', 'admin.email'])
      .leftJoin('log.targetUser', 'targetUser')
      .addSelect(['targetUser.userId', 'targetUser.name', 'targetUser.email'])
      .orderBy('log.createdAt', 'DESC')
      .addOrderBy('log.auditId', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: logs.map((log) => this.toAuditLogResponse(log)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  private toAuditLogResponse(log: AdminAuditLog): AuditLogResponseDto {
    return {
      auditId: log.auditId,
      action: log.action,
      createdAt: log.createdAt,
      reason: log.reason,
      changes: log.changes,
      resourceIds: log.resourceIds,
      // Usuário excluído: a relação vira null e usamos o ID preservado.
      admin: this.toAuditLogUser(log.admin, log.adminIdSnapshot),
      targetUser: this.toAuditLogUser(log.targetUser, log.targetUserIdSnapshot),
    };
  }

  private toAuditLogUser(
    user: User | null | undefined,
    snapshotId: string,
  ): AuditLogUserDto {
    return {
      userId: user?.userId ?? snapshotId,
      name: user?.name ?? null,
      email: user?.email ?? null,
    };
  }

  async findUsers(query: ListUsersQueryDto): Promise<AdminUserListResponseDto> {
    const { type, status, search, page, limit } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.students', 'student')
      .leftJoin('user.teachers', 'teacher');

    if (type) {
      qb.andWhere('user.type = :type', { type });
    }

    if (status) {
      qb.andWhere('user.status = :status', { status });
    }

    const term = search?.trim();

    if (term) {
      const pattern = `%${this.escapeLikeTerm(term)}%`;

      qb.andWhere(
        new Brackets((builder) => {
          builder
            .where('user.name ILIKE :pattern', { pattern })
            .orWhere('user.email ILIKE :pattern', { pattern })
            .orWhere('student.registration_student ILIKE :pattern', { pattern })
            .orWhere('teacher.registration_teacher ILIKE :pattern', {
              pattern,
            });
        }),
      );
    }

    const totalItems = await qb.clone().getCount();

    if (totalItems === 0) {
      return {
        data: [],
        meta: { page, limit, totalItems: 0, totalPages: 0 },
      };
    }

    const rows = await qb
      .select('user.userId', 'userId')
      .addSelect('user.name', 'name')
      .addSelect('user.email', 'email')
      .addSelect('user.type', 'type')
      .addSelect('user.status', 'status')
      .addSelect('user.createdAt', 'createdAt')
      .addSelect('student.registration_student', 'registrationStudent')
      .addSelect('teacher.registration_teacher', 'registrationTeacher')
      .orderBy('user.name', 'ASC')
      .addOrderBy('user.userId', 'ASC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<RawAdminUserRow>();

    return {
      data: rows.map((row) => this.toResponse(row)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  private escapeLikeTerm(term: string): string {
    return term.replace(/[\\%_]/g, (character) => `\\${character}`);
  }

  private toResponse(row: RawAdminUserRow): AdminUserResponseDto {
    return {
      userId: row.userId,
      name: row.name,
      email: row.email,
      type: row.type,
      status: row.status,
      registration: this.registrationDoPerfil(row),
      createdAt: row.createdAt,
    };
  }

  private registrationDoPerfil(row: RawAdminUserRow): string | null {
    if (row.type === UserType.STUDENT) {
      return row.registrationStudent ?? null;
    }

    if (row.type === UserType.TEACHER) {
      return row.registrationTeacher ?? null;
    }

    return null;
  }
}
