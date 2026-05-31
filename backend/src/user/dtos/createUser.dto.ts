import {
  Matches,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from 'src/Enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria Silva', description: 'Nome do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({ example: 'maria@exemplo.com', description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser uma string' })
  @Matches(/^.+@.+\.com$/, {
    message: 'O email deve estar no formato exemplo@exemplo.com',
  })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;

  @ApiProperty({
    example: 'student',
    description: 'Tipo do usuário (student, teacher ou admin)',
    enum: UserType,
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: UserType;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Matrícula do estudante (opcional)',
  })
  @IsOptional()
  registrationStudent?: string;

  @ApiPropertyOptional({
    example: '654321',
    description: 'Matrícula do professor (opcional)',
  })
  @IsOptional()
  registrationTeacher?: string;
}