import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class DeactivateUserDto {
  @ApiProperty({ example: 'Usuário desligado da instituição' })
  @IsString()
  @Matches(/\S/, { message: 'Informe o motivo da desativação' })
  @MaxLength(500)
  reason!: string;
}
