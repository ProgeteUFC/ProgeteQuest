import { IsOptional, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Maria Silva', description: 'Nome do usuário' })
  @IsOptional()
  @IsNotEmpty({ message: 'Nome não pode estar em branco' })
  name?: string;

  @ApiPropertyOptional({ example: 'maria@exemplo.com', description: 'Email do usuário' })
  @IsOptional()
  @IsNotEmpty({ message: 'Email não pode estar em branco' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email?: string;

  @ApiPropertyOptional({ example: 'novaSenha123', description: 'Senha do usuário' })
  @IsOptional()
  @IsNotEmpty({ message: 'Senha não pode estar em branco' })
  password?: string;

  @ApiPropertyOptional({ example: '123456', description: 'Matrícula do estudante (opcional)' })
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de estudante deve conter exatamente 6 dígitos numéricos',
  })
  registrationStudent?: string;

  @ApiPropertyOptional({ example: '654321', description: 'Matrícula do professor (opcional)' })
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de professor deve conter exatamente 6 dígitos numéricos',
  })
  registrationTeacher?: string;
}
