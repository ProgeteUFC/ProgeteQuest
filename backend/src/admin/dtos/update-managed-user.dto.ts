import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateManagedUserDto {
  @ApiPropertyOptional({ example: 'Maria Silva' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/\S/, { message: 'Nome não pode ser vazio' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 'maria@exemplo.com' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsEmail()
  @IsString()
  @MaxLength(100)
  @Matches(/^.+@.+\.com$/, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional({ example: '123456' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/^\d{6}$/)
  registrationStudent?: string;

  @ApiPropertyOptional({ example: '654321' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/^\d{6}$/)
  registrationTeacher?: string;
}
