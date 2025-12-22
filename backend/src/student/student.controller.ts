import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // @Post()
  // async create(@Body() body: any) {
  //   return this.studentService.create(body);
  // }
}
