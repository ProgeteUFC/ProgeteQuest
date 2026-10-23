import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDashboardService } from './admin-dashboard.service';
import { TeacherTransferService } from './teacher-transfer.service';
import { AUDIT_TRAIL } from '../common/audit/audit-trail';
import { PendingAuditTrail } from '../common/audit/pending-audit-trail';
import { Class } from '../class/entities/class.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Class]), UserModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminDashboardService,
    TeacherTransferService,
    // Troque pela implementação definitiva quando o registro automático de
    // auditoria estiver disponível: o contrato AuditTrail já é o que o
    // TeacherTransferService consome.
    { provide: AUDIT_TRAIL, useClass: PendingAuditTrail },
  ],
})
export class AdminModule {}
