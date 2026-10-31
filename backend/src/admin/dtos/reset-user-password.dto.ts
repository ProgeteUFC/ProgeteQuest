import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetUserPasswordDto {
  @ApiProperty({ description: 'Nova senha do usuário, entre 8 caracteres e 72 bytes.', format: 'password', writeOnly: true })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/\S/, { message: 'A senha não pode conter somente espaços.' })
  newPassword!: string;

  @ApiProperty({ description: 'Motivo da redefinição administrativa.' })
  @IsString()
  @Matches(/\S/, { message: 'Informe o motivo da redefinição.' })
  @MaxLength(500)
  reason!: string;
}
