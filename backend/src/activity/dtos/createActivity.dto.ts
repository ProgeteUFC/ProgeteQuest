import { ActivityType } from 'src/Enums/activity.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Seminário de Matemática', description: 'Nome exibido para a atividade.', maxLength: 50 })
  name!: string;

  @ApiProperty({ example: '2026-10-10T23:59:59.000Z', description: 'Prazo limite da atividade em ISO 8601.', format: 'date-time' })
  date!: string;

  @ApiProperty({ example: ActivityType.SEMINAR, description: 'Categoria usada no check-in e ranking.', enum: ActivityType, enumName: 'ActivityType' })
  type!: ActivityType;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da turma relacionada.', format: 'uuid' })
  classId!: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', description: 'ID de avaliação, caso a atividade pertença a uma.', format: 'uuid', nullable: true })
  assessmentId?: string;
}
