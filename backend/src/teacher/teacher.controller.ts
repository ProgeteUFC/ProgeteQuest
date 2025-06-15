import { Body, Controller, Post } from '@nestjs/common';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  // @Post()
  // async create(@Body() body: { userId: string; registrationTeacher: string }) {
  //   return this.teacherService.create(body);
  // }
}
