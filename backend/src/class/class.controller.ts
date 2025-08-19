import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';
import { Patch, Param } from '@nestjs/common';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  getAll(): Promise<Class[]> {
    return this.classService.getAllClasses();
  }

  @Post()
  create(@Body() newClass: CreateClassDto): Promise<Class> {
    return this.classService.createClass(newClass);
  }

  @Patch(':id/join-code')
  async regenerateJoinCode(@Param('id') id: string): Promise<Class> {
    return this.classService.regenerateJoinCode(id);
  }

  @Post('join')
  async joinClass(@Body() body: { studentId: string; joinCode: string }) {
    return this.classService.joinClassByCode(body.studentId, body.joinCode);
  }

  @Post('enroll')
  async enrollStudent(
    @Body() body: { registrationStudent: string; joinCode: string },
  ) {
    return this.classService.enrollStudentByRegistration(
      body.registrationStudent,
      body.joinCode,
    );
  }
}
