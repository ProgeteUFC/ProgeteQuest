import { ActivityType } from 'src/Enums/activity.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Seminário de Matemática', description: 'Nome da atividade' })
  name!: string;

  @ApiProperty({ example: '2024-05-10T00:00:00Z', description: 'Data da atividade (formato ISO 8601)' })
  date!: string;

  @ApiProperty({ example: 'seminar', description: 'Tipo da atividade (activity, seminar ou attendance)' })
  type!: ActivityType;

  @ApiProperty({ example: 'uuid-da-turma', description: 'ID da turma relacionada' })
  classId!: string;

  @ApiProperty({ example: 'uuid-da-avaliacao', description: 'ID da avaliação relacionada' })
  assessmentId?: string;
}
