import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeactivateUserDto {
  @ApiProperty({
    example: 'Professor desligado da instituição',
    description: 'Motivo da desativação do usuário.',
  })
  @IsNotEmpty({ message: 'O motivo da desativação é obrigatório' })
  @IsString({ message: 'O motivo deve ser uma string' })
  reason!: string;
}
