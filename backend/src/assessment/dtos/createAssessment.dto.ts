import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({ example: 'Avaliação 1', description: 'Nome da avaliação.', maxLength: 50 })
  @IsString()
  @Matches(/\S/, { message: 'Informe o nome da avaliação.' })
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da turma relacionada.', format: 'uuid' })
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId: string;
}
