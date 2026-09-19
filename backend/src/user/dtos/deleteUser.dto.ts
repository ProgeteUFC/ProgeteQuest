import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({
    example: 'senha123',
    description: 'Senha atual, usada para confirmar a exclusão definitiva da conta.',
    format: 'password',
  })
  password: string;
}
