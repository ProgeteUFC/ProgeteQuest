import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserByAdminDto {
  @ApiPropertyOptional({
    example: 'Maria Silva',
    description: 'Novo nome do usuário.',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @Matches(/\S/, { message: 'Nome não pode estar em branco' })
  name?: string;

  @ApiPropertyOptional({
    example: 'maria@exemplo.com',
    description: 'Novo e-mail do usuário.',
  })
  @IsOptional()
  @IsString({ message: 'Email deve ser uma string' })
  @IsEmail({}, { message: 'Email inválido' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email?: string;

  @ApiPropertyOptional({
    example: 'novaSenha123',
    description: 'Nova senha. É criptografada antes de ser salva.',
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @Matches(/\S/, { message: 'Senha não pode estar em branco' })
  password?: string;

  @ApiPropertyOptional({
    example: '123456',
    description:
      'Nova matrícula (6 dígitos). Só pode ser informada para usuários do tipo student.',
  })
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de estudante deve conter exatamente 6 dígitos numéricos',
  })
  registrationStudent?: string;

  @ApiPropertyOptional({
    example: '654321',
    description:
      'Novo SIAPE (6 dígitos). Só pode ser informado para usuários do tipo teacher.',
  })
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message:
      'Matrícula de professor deve conter exatamente 6 dígitos numéricos',
  })
  registrationTeacher?: string;
}
