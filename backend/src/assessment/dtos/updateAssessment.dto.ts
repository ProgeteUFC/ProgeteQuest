import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssessmentDto {
  @ApiPropertyOptional({ example: 'Avaliação 1', description: 'Nome da avaliação' })
  name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da turma relacionada.', format: 'uuid' })
  classId?: string;
}
