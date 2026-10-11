
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';
import { AdminDashboardService } from './admin-dashboard.service';

import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { Class } from '../class/entities/class.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, Class]),
  ],
  controllers: [AdminController],
  providers: [AdminDashboardService],
})
export class AdminModule {}
