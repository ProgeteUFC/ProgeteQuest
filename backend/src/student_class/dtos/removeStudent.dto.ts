import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RemoveStudentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da turma da qual o aluno será removido.',
    format: 'uuid',
  })
  @IsUUID(undefined, { message: 'classId deve ser um UUID válido.' })
  classId: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Matrícula do aluno. Informe este campo ou studentId.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'A matrícula deve conter exatamente 6 dígitos numéricos.',
  })
  registrationStudent?: string;

  @ApiPropertyOptional({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    description: 'ID de usuário do aluno. Informe este campo ou registrationStudent.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(undefined, { message: 'studentId deve ser um UUID válido.' })
  studentId?: string;
}
