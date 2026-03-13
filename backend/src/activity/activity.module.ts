import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Class } from 'src/class/entities/class.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity'; // ADICIONE ESTA LINHA

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Class, Assessment, Checkin]), // ADICIONE Checkin AQUI
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
