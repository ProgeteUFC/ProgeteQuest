import { IsOptional, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Nome não pode estar em branco' })
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Email não pode estar em branco' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Senha não pode estar em branco' })
  password?: string;

  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de estudante deve conter exatamente 6 dígitos numéricos',
  })
  registrationStudent?: string;

  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de professor deve conter exatamente 6 dígitos numéricos',
  })
  registrationTeacher?: string;
}
