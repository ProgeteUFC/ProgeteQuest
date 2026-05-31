import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchActivityDto {
  @ApiPropertyOptional({ example: 'Prova', description: 'Nome da atividade para busca' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name?: string;

  @ApiPropertyOptional({ example: 'uuid-da-turma', description: 'ID da turma para busca' })
  @IsOptional()
  @IsUUID(4, { message: 'O classId deve ser um UUID válido' })
  classId?: string;

  @ApiPropertyOptional({ example: 'uuid-da-avaliacao', description: 'ID da avaliação para busca' })
  @IsOptional()
  @IsUUID(4, { message: 'O assessmentId deve ser um UUID válido' })
  assessmentId?: string;
}
