import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateManagedUserDto {
  @ApiPropertyOptional({ example: 'Maria Silva' })
  @IsOptional()
  @IsString()
  @Matches(/\S/, { message: 'Nome não pode ser vazio' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'maria@exemplo.com' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^.+@.+\.com$/, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/)
  registrationStudent?: string;

  @ApiPropertyOptional({ example: '654321' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/)
  registrationTeacher?: string;
}
