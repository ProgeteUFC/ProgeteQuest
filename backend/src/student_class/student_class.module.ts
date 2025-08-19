import { Module } from '@nestjs/common';
import { StudentClassService } from './student_class.service';

@Module({
  providers: [StudentClassService]
})
export class StudentClassModule {}
