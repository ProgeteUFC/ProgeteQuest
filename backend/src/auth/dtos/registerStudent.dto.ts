import { Matches, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Cadastro público: aceita somente dados de aluno.
 * Não existe campo `type` aqui de propósito — quem define o tipo é o
 * servidor, em AuthController.registerStudent.
 */
export class RegisterStudentDto {
  @ApiProperty({ example: 'Maria Silva', description: 'Nome do aluno' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name!: string;

  @ApiProperty({ example: 'maria@exemplo.com', description: 'Email do aluno' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser uma string' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do aluno' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password!: string;

  @ApiProperty({ example: '123456', description: 'Matrícula do aluno' })
  @IsNotEmpty({ message: 'registrationStudent é obrigatório' })
  @Matches(/^\d{6}$/, {
    message: 'registrationStudent deve conter exatamente 6 dígitos numéricos',
  })
  registrationStudent!: string;
}
