import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Admin } from '../admin/entities/admin.entity';
import { AdminUserController } from './admin-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Teacher, Admin])],
  providers: [UserService],
  controllers: [UserController, AdminUserController],
})
export class UserModule {}
