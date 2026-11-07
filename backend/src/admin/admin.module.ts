import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { TeacherTransferService } from './teacher-transfer.service';
import { AuditModule } from '../audit/audit.module';
import { AdminAuditLog } from '../audit/entities/admin-audit-log.entity';
import { Class } from '../class/entities/class.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class, AdminAuditLog]), UserModule, AuditModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminDashboardService,
    TeacherTransferService,
  ],
})
export class AdminModule {}
