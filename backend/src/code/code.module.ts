import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from './entities/code.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Class } from 'src/class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Code, Activity, Class])],
  providers: [CodeService],
  controllers: [CodeController],
})
export class CodeModule {}
