import { Module } from '@nestjs/common';
import { classController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  controllers: [classController],
  providers: [ClassService]
})
export class StudentModule {}