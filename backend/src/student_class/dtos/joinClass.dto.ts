import { ApiProperty } from '@nestjs/swagger';

export class JoinClassDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de usuário do aluno que entrará na turma.',
    format: 'uuid',
  })
  studentId: string;

  @ApiProperty({
    example: 'A1B2C3D4E5',
    description: 'Código de entrada de 10 caracteres fornecido pelo professor.',
    minLength: 10,
    maxLength: 10,
  })
  joinCode: string;
}
