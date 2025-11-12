import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SearchActivityDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsOptional()
  @IsUUID(4, { message: 'O classId deve ser um UUID válido' })
  classId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'O assessmentId deve ser um UUID válido' })
  assessmentId?: string;
}
