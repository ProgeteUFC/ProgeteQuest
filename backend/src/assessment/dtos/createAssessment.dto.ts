import { ApiProperty } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiProperty({ example: 'Avaliação 1', description: 'Nome da avaliação' })
  name: string;

  @ApiProperty({ example: 'uuid-da-turma', description: 'ID da turma relacionada' })
  classId: string;
}
