import { Matches, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser uma string' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;

  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: 'student' | 'teacher';

  registrationStudent?: string;
  registrationTeacher?: string;
}
