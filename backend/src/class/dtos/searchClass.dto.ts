import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class SearchClassDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O código deve ser um texto' })
  @Length(10, 10, { message: 'O código de turma deve ter 10 caracteres' })
  joinCode?: string;
}
