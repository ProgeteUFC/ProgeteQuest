import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'maria@exemplo.com',
    description: 'E-mail cadastrado do usuário.',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha cadastrada do usuário.',
    format: 'password',
  })
  password: string;
}
