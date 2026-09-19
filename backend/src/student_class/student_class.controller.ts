import { Controller, Delete, Body, Post, Param, Get } from '@nestjs/common';
import { StudentClassService } from './student_class.service';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { RemoveStudentDto } from './dtos/removeStudent.dto';
import { JoinClassDto } from './dtos/joinClass.dto';
import { EnrollStudentDto } from './dtos/enrollStudent.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Matrículas')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
@Controller('student-class')
export class StudentClassController {
  constructor(private readonly studentClassService: StudentClassService) {}

  @Roles('student')
  @ApiOperation({
    summary: 'Entrar em uma turma pelo código',
    description: 'Perfil permitido: student. Vincula o aluno à turma correspondente ao código de entrada.',
  })
  @ApiBody({ type: JoinClassDto })
  @ApiResponse({ status: 201, description: 'Aluno matriculado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Aluno ou código de turma não encontrado.' })
  @ApiConflictResponse({ description: 'O aluno já está matriculado nessa turma.' })
  @Post('join')
  async joinClass(@Body() body: JoinClassDto) {
    return this.studentClassService.joinClassByCode(
      body.studentId,
      body.joinCode,
    );
  }

  @Roles('teacher')
  @ApiOperation({
    summary: 'Matricular aluno pela matrícula',
    description: 'Perfil permitido: teacher. Adiciona um aluno usando sua matrícula e o código da turma.',
  })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 201, description: 'Aluno matriculado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Aluno ou código de turma não encontrado.' })
  @ApiConflictResponse({ description: 'O aluno já está matriculado nessa turma.' })
  @Post('enroll')
  async enrollStudent(@Body() body: EnrollStudentDto) {
    return this.studentClassService.enrollStudentByRegistration(
      body.registrationStudent,
      body.joinCode,
    );
  }

  // Remover aluno — DELETE /student-class
  // Body JSON: { classId, registrationStudent? , studentId? }
  @Roles('teacher')
  @ApiOperation({
    summary: 'Remover aluno de uma turma',
    description: 'Perfil permitido: teacher. Informe classId e registrationStudent ou studentId.',
  })
  @ApiBody({ type: RemoveStudentDto })
  @ApiResponse({ status: 200, description: 'Aluno removido da turma.' })
  @ApiForbiddenResponse({ description: 'O professor não é responsável pela turma.' })
  @ApiNotFoundResponse({ description: 'Turma, aluno ou matrícula não encontrados.' })
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
  @ApiOperation({
    summary: 'Consultar ranking da turma',
    description: 'Perfis permitidos: teacher e student. Ordena alunos por check-ins e pontuação.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma.', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Ranking retornado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Turma sem participantes ou não encontrada.' })
  @Get(':id/ranking')
  async getRanking(@Param('id') classId: string) {
    return this.studentClassService.getClassRanking(classId);
  }

  @Roles('teacher', 'student')
  @ApiOperation({
    summary: 'Listar membros da turma',
    description: 'Perfis permitidos: teacher e student. Retorna nome, e-mail e matrícula dos alunos.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma.', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Participantes retornados com sucesso.' })
  @ApiNotFoundResponse({ description: 'A turma ainda não possui participantes.' })
  @Get(':id/participants')
  async getParticipants(@Param('id') classId: string) {
    return this.studentClassService.getClassParticipants(classId);
  }

  @Roles('student')
  @ApiOperation({
    summary: 'Listar turmas de um aluno',
    description: 'Perfil permitido: student. Retorna todas as turmas em que o aluno está matriculado.',
  })
  @ApiParam({ name: 'studentId', description: 'ID de usuário do aluno.', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Turmas do aluno retornadas com sucesso.' })
  @Get('student/:studentId')
  async getStudentClasses(@Param('studentId') studentId: string) {
    return this.studentClassService.getStudentClasses(studentId);
  }
}
