import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: 'senha123',
    description: 'Senha atual, usada para confirmar a exclusão definitiva da conta.',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
