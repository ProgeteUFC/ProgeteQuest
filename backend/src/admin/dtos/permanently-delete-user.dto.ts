import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsBoolean, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class PermanentlyDeleteUserDto {
  @ApiProperty({
    example: 'Conta duplicada, após revisão dos dados vinculados.',
    description: 'Motivo da exclusão definitiva do usuário.',
  })
  @IsNotEmpty({ message: 'O motivo da exclusão é obrigatório' })
  @IsString({ message: 'O motivo deve ser uma string' })
  @Matches(/\S/, { message: 'O motivo não pode conter apenas espaços' })
  @MaxLength(500)
  reason!: string;

  @ApiProperty({
    description: 'Senha atual do administrador responsável pela exclusão.',
    format: 'password',
    writeOnly: true,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha do administrador é obrigatória' })
  password!: string;

  @ApiProperty({
    example: true,
    enum: [true],
    description: 'Deve ser true para confirmar a exclusão definitiva do usuário.',
  })
  @IsBoolean({ message: 'A confirmação deve ser um booleano' })
  @Equals(true, { message: 'É necessário confirmar a exclusão definitiva' })
  confirm!: boolean;
}
