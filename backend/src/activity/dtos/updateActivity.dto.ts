import { ActivityType } from 'src/Enums/activity.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateActivityDto {
  @ApiPropertyOptional({ example: 'Seminário atualizado', maxLength: 50 })
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'O campo "name" não pode ser vazio.' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: '2026-10-12T23:59:59.000Z', format: 'date-time' })
  @IsOptional()
  @IsDateString({}, { message: 'A data deve estar no formato ISO 8601.' })
  date?: string;

  @ApiPropertyOptional({ enum: ActivityType, enumName: 'ActivityType', example: ActivityType.ACTIVITY })
  @IsOptional()
  @IsEnum(ActivityType, { message: 'Tipo de atividade inválido.' })
  type?: ActivityType;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  @IsOptional()
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId?: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID(undefined, { message: 'assessmentId deve ser um UUID válido.' })
  assessmentId?: string;
}
