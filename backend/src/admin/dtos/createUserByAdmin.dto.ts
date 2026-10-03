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
 * Cadastro administrativo: cria aluno ou professor.
 * `admin` não entra aqui — contas de administrador não são criadas por API.
 */
export class CreateUserByAdminDto {
  @ApiProperty({ example: 'Carlos Souza', description: 'Nome do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name!: string;

  @ApiProperty({
    example: 'carlos@exemplo.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser uma string' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password!: string;

  @ApiProperty({
    example: UserType.TEACHER,
    description:
      'Tipo do usuário. Use student para aluno ou teacher para professor.',
    enum: [UserType.STUDENT, UserType.TEACHER],
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsIn([UserType.STUDENT, UserType.TEACHER], {
    message: 'Tipo deve ser student ou teacher',
  })
  type!: UserType.STUDENT | UserType.TEACHER;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'Matrícula obrigatória apenas quando o tipo do usuário for student.',
  })
  @IsOptional()
  registrationStudent?: string;

  @ApiPropertyOptional({
    example: '654321',
    description:
      'Matrícula obrigatória apenas quando o tipo do usuário for teacher.',
  })
  @IsOptional()
  registrationTeacher?: string;
}
