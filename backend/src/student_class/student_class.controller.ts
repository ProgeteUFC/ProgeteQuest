import { Controller, Delete, Body, Post, Param, Get } from '@nestjs/common';
import { StudentClassService } from './student_class.service';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { RemoveStudentDto } from './dtos/removeStudent.dto';

@Controller('student-class')
export class StudentClassController {
  constructor(private readonly studentClassService: StudentClassService) {}

  @Roles('student')
  @Post('join')
  async joinClass(@Body() body: { studentId: string; joinCode: string }) {
    return this.studentClassService.joinClassByCode(
      body.studentId,
      body.joinCode,
    );
  }

  @Roles('teacher')
  @Post('enroll')
  async enrollStudent(
    @Body() body: { registrationStudent: string; joinCode: string },
  ) {
    return this.studentClassService.enrollStudentByRegistration(
      body.registrationStudent,
      body.joinCode,
    );
  }

  // Remover aluno — DELETE /student-class
  // Body JSON: { classId, registrationStudent? , studentId? }
  @Roles('teacher')
  @Delete()
  async remove(@Body() body: RemoveStudentDto, @User() user: UserPayload) {
    const { classId, registrationStudent, studentId } = body;

    if (!classId) {
      return { message: 'classId é obrigatório' };
    }

    // ValidationPipe will ensure classId is present and string; enforce at least one identifier
    if (!registrationStudent && !studentId) {
      throw new (await import('@nestjs/common')).BadRequestException(
        'registrationStudent ou studentId deve ser informado',
      );
    }

    if (registrationStudent) {
      return this.studentClassService.removeStudentByRegistration(
        registrationStudent,
        classId,
        user.userId,
      );
    }

    // studentId is present (otherwise above would have thrown)
    return this.studentClassService.removeStudentByUserId(
      studentId!,
      classId,
      user.userId,
    );
  }

  @Roles('teacher', 'student')
  @Get(':id/ranking')
  async getRanking(@Param('id') classId: string) {
    return this.studentClassService.getClassRanking(classId);
  }

  @Roles('teacher', 'student')
  @Get(':id/participants')
  async getParticipants(@Param('id') classId: string) {
    return this.studentClassService.getClassParticipants(classId);
  }

  @Roles('student')
  @Get('student/:studentId')
  async getStudentClasses(@Param('studentId') studentId: string) {
    return this.studentClassService.getStudentClasses(studentId);
  }
}
