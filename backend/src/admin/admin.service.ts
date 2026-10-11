import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserStatus, UserType } from 'src/Enums/user.enum';
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
  ) {}

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
