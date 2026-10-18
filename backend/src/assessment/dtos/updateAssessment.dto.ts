import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateAssessmentDto {
  @ApiPropertyOptional({ example: 'Avaliação 1', description: 'Nome da avaliação' })
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'O campo "name" não pode ser vazio.' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da turma relacionada.', format: 'uuid' })
  @IsOptional()
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId?: string;
}
