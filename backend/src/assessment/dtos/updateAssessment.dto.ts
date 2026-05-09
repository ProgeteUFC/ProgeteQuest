import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssessmentDto {
  @ApiPropertyOptional({ example: 'Avaliação 1', description: 'Nome da avaliação' })
  name?: string;

  @ApiPropertyOptional({ example: 'uuid-da-turma', description: 'ID da turma relacionada' })
  classId?: string;
}
