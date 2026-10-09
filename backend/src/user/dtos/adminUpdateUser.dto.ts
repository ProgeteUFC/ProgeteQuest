import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class AdminUpdateUserDto {
  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/\S/, { message: 'Nome não pode estar em branco' })
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional()
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ example: '123456' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Matrícula deve conter exatamente 6 dígitos' })
  registrationStudent?: string;

  @ApiPropertyOptional({ example: '654321' })
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Matches(/^\d{6}$/, { message: 'SIAPE deve conter exatamente 6 dígitos' })
  registrationTeacher?: string;
}
