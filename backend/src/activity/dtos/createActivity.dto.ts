import { ActivityType } from 'src/Enums/activity.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 'Seminário de Matemática', description: 'Nome exibido para a atividade.', maxLength: 50 })
  @IsString()
  @Matches(/\S/, { message: 'Informe o nome da atividade.' })
  @MaxLength(50)
  name!: string;

  @ApiProperty({ example: '2026-10-10T23:59:59.000Z', description: 'Prazo limite da atividade em ISO 8601.', format: 'date-time' })
  @IsDateString({}, { message: 'A data deve estar no formato ISO 8601.' })
  date!: string;

  @ApiProperty({ example: ActivityType.SEMINAR, description: 'Categoria usada no check-in e ranking.', enum: ActivityType, enumName: 'ActivityType' })
  @IsEnum(ActivityType, { message: 'Tipo de atividade inválido.' })
  type!: ActivityType;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da turma relacionada.', format: 'uuid' })
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId!: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', description: 'ID de avaliação, caso a atividade pertença a uma.', format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID(undefined, { message: 'assessmentId deve ser um UUID válido.' })
  assessmentId?: string;
}
