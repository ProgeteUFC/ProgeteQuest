import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Class } from 'src/class/entities/class.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Class, Assessment])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
