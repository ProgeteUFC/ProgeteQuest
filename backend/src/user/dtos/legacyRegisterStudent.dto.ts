import {
  Matches,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from 'src/Enums/user.enum';

/**
 * Corpo aceito pela rota legada POST /user, mantida apenas enquanto o
 * frontend não migra para POST /auth/register/student.
 *
 * `type` só existe aqui para poder recusar com mensagem clara quem tenta se
 * cadastrar como professor. Quando vem 'student', é ignorado: o tipo real é
 * definido pelo servidor.
 */
export class LegacyRegisterStudentDto {
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

  @ApiPropertyOptional({
    example: UserType.STUDENT,
    description:
      'Opcional e aceito somente como student. Contas de professor são criadas por um administrador.',
    enum: [UserType.STUDENT],
  })
  @IsOptional()
  @IsIn([UserType.STUDENT], {
    message:
      'Esta rota cria apenas contas de aluno. Contas de professor são criadas por um administrador.',
  })
  type?: UserType;

  @ApiProperty({ example: '123456', description: 'Matrícula do aluno' })
  @IsOptional()
  registrationStudent?: string;
}
