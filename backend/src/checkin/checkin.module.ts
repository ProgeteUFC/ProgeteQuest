import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from './entities/checkin.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Code } from 'src/code/entities/code.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Activity, Code, StudentClass])],
  providers: [CheckinService],
  controllers: [CheckinController],
})
export class CheckinModule {}
