import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinClassDto {
  @ApiProperty({
    example: 'A1B2C3D4E5',
    description: 'Código de entrada de 10 caracteres fornecido pelo professor.',
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  joinCode: string;
}
