import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/class/entities/class.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Teacher, StudentClass])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
