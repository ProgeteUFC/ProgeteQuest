import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RemoveStudentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da turma da qual o aluno será removido.',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  classId: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Matrícula do aluno. Informe este campo ou studentId.',
  })
  @IsOptional()
  @IsString()
  registrationStudent?: string;

  @ApiPropertyOptional({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    description: 'ID de usuário do aluno. Informe este campo ou registrationStudent.',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  studentId?: string;
}
