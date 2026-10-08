import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Class } from 'src/class/entities/class.entity';
import { UserType, UserStatus } from 'src/Enums/user.enum';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getDashboard() {
    const [
      activeStudents,
      inactiveStudents,
      activeTeachers,
      inactiveTeachers,
      totalClasses,
      recentlyDisabledUsers,
    ] = await Promise.all([
      this.userRepository.count({
        where: {
          type: UserType.STUDENT,
          status: UserStatus.ACTIVE,
        },
      }),

      this.userRepository.count({
        where: {
          type: UserType.STUDENT,
          status: UserStatus.INACTIVE,
        },
      }),

      this.userRepository.count({
        where: {
          type: UserType.TEACHER,
          status: UserStatus.ACTIVE,
        },
      }),

      this.userRepository.count({
        where: {
          type: UserType.TEACHER,
          status: UserStatus.INACTIVE,
        },
      }),

      this.classRepository.count(),

      this.userRepository.find({
        where: {
          status: UserStatus.INACTIVE,
          deactivatedAt: Not(IsNull()),
        },
        select: {
          userId: true,
          name: true,
          email: true,
          type: true,
          deactivatedAt: true,
        },
        order: {
          deactivatedAt: 'DESC',
        },
        take: 5,
      }),
    ]);

    return {
      students: {
        active: activeStudents,
        inactive: inactiveStudents,
      },
      teachers: {
        active: activeTeachers,
        inactive: inactiveTeachers,
      },
      totalClasses,
      recentlyDisabledUsers,
    };
  }
}
