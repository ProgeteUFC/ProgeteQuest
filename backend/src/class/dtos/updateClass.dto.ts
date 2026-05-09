import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Turma 1', description: 'Nome da turma' })
  name?: string;

  @ApiPropertyOptional({ example: 'uuid-da-turma', description: 'ID da turma' })
  classId?: string;

  @ApiPropertyOptional({ example: 'uuid-do-professor', description: 'ID do professor responsável' })
  teacherId?: string;

  @ApiPropertyOptional({ example: 'uuid-da-avaliacao', description: 'ID da avaliação associada' })
  assessmentId?: string;
}
