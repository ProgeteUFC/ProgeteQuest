import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Requisitos de Software', description: 'Novo nome da turma.', maxLength: 50 })
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'O campo "name" não pode ser vazio.' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Novo ID da turma. Evite alterar este campo.', format: 'uuid' })
  @IsOptional()
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId?: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', description: 'Novo professor responsável.', format: 'uuid' })
  @IsOptional()
  @IsUUID(undefined, { message: 'teacherId deve ser um UUID válido.' })
  teacherId?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsUUID(undefined, { message: 'assessmentId deve ser um UUID válido.' })
  assessmentId?: string;
}
