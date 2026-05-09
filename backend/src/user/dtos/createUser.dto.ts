import { Matches, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'student', description: 'Tipo do usuário (student ou teacher)' })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: 'student' | 'teacher';

  @ApiProperty({ example: '123456', description: 'Matrícula do estudante (opcional)' })
  registrationStudent?: string;

  @ApiProperty({ example: '654321', description: 'Matrícula do professor (opcional)' })
  registrationTeacher?: string;
}
