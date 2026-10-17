import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({
    example: '123456',
    description: 'Matrícula de 6 dígitos do aluno.',
  })
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'A matrícula deve conter exatamente 6 dígitos numéricos.',
  })
  registrationStudent: string;

  @ApiProperty({
    example: 'A1B2C3D4E5',
    description: 'Código de entrada da turma.',
  })
  @IsString()
  @Length(10, 10, { message: 'O código de turma deve ter 10 caracteres.' })
  joinCode: string;
}
