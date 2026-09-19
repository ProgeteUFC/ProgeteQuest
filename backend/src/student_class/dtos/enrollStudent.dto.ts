import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({
    example: '123456',
    description: 'Matrícula de 6 dígitos do aluno.',
  })
  registrationStudent: string;

  @ApiProperty({
    example: 'A1B2C3D4E5',
    description: 'Código de entrada da turma.',
  })
  joinCode: string;
}
