import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Requisitos de Software', description: 'Nome da turma.', maxLength: 50 })
  name: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Somente para admin: ID do professor responsável. Para professor, o backend usa o usuário autenticado.',
    format: 'uuid',
  })
  teacherId?: string;
}
