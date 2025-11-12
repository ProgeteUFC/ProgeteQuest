import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchClassDto } from './dtos/searchClass.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles('teacher', 'student')
  @Get()
  getAll(): Promise<Class[]> {
    return this.classService.getAllClasses();
  }

  @Roles('teacher')
  @Post()
  create(@Body() newClass: CreateClassDto): Promise<Class> {
    return this.classService.createClass(newClass);
  }

  @Roles('teacher')
  @Patch(':id/join-code')
  async regenerateJoinCode(@Param('id') id: string): Promise<Class> {
    return this.classService.regenerateJoinCode(id);
  }

  @Roles('student')
  @Post('join')
  async joinClass(@Body() body: { studentId: string; joinCode: string }) {
    return this.classService.joinClassByCode(body.studentId, body.joinCode);
  }

  @Roles('teacher')
  @Post('enroll')
  async enrollStudent(
    @Body() body: { registrationStudent: string; joinCode: string },
  ) {
    return this.classService.enrollStudentByRegistration(
      body.registrationStudent,
      body.joinCode,
    );
  }

  @Roles('teacher')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedClass: UpdateClassDto,
  ): Promise<Class> {
    return this.classService.updateClass(id, updatedClass);
  }

  @Roles('teacher')
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.classService.deleteClass(id);
  }

  @Roles('teacher', 'student')
  @Get(':id/ranking')
  async getRanking(@Param('id') classId: string) {
    return this.classService.getClassRanking(classId);
  }

  @Roles('teacher', 'student')
  @Get(':id/participants')
  async getParticipants(@Param('id') classId: string) {
    return this.classService.getClassParticipants(classId);
  }

  @Roles('student')
  @Get('student/:studentId')
  async getStudentClasses(@Param('studentId') studentId: string) {
    return this.classService.getStudentClasses(studentId);
  }

  @Roles('teacher', 'student')
  @Post('search')
  async searchClasses(@Body() searchDto: SearchClassDto) {
    return this.classService.searchClasses(searchDto);
  }
}
