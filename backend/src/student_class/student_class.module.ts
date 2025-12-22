import { Module } from '@nestjs/common';
import { StudentClassService } from './student_class.service';
import { StudentClassController } from './student_class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Class } from 'src/class/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentClass, Teacher, Class, Student, Checkin]),
  ],
  controllers: [StudentClassController],
  providers: [StudentClassService],
})
export class StudentClassModule {}
