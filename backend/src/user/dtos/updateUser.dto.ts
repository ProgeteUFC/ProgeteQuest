import {
  IsOptional,
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar em branco' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Email deve ser uma string' })
  @IsNotEmpty({ message: 'Email não pode estar em branco' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar em branco' })
  password?: string;
}
