import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Requisitos de Software', description: 'Novo nome da turma.', maxLength: 50 })
  name?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Novo ID da turma. Evite alterar este campo.', format: 'uuid' })
  classId?: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', description: 'Novo professor responsável.', format: 'uuid' })
  teacherId?: string;

  @ApiHideProperty()
  assessmentId?: string;

}
