import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus, UserType } from 'src/Enums/user.enum';

const PAGE_PADRAO = 1;
const LIMITE_PADRAO = 20;

const vazioVira = <T>(padrao: T) =>
  Transform(({ value }: { value: unknown }) =>
    value === undefined || value === null || value === '' ? padrao : value,
  );

const vazioViraNumero = (padrao: number) =>
  Transform(({ value }: { value: unknown }) =>
    value === undefined || value === null || value === ''
      ? padrao
      : Number(value),
  );

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    enum: UserType,
    example: UserType.TEACHER,
    description:
      'Filtra pelo perfil do usuário. Omitido ou vazio, retorna todos.',
  })
  @vazioVira(undefined)
  @IsOptional()
  @IsEnum(UserType, { message: 'type deve ser student, teacher ou admin' })
  type?: UserType;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description:
      'Filtra pelo status da conta. Omitido ou vazio, retorna ativos e inativos.',
  })
  @vazioVira(undefined)
  @IsOptional()
  @IsEnum(UserStatus, { message: 'status deve ser active ou inactive' })
  status?: UserStatus;

  @ApiPropertyOptional({
    example: 'maria',
    description:
      'Busca parcial e sem distinção de maiúsculas por nome, e-mail, matrícula de aluno ou SIAPE de professor.',
  })
  @vazioVira(undefined)
  @IsOptional()
  @IsString({ message: 'search deve ser uma string' })
  @MaxLength(100, { message: 'search deve ter no máximo 100 caracteres' })
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    default: PAGE_PADRAO,
    minimum: 1,
    description: 'Página desejada, começando em 1.',
  })
  @vazioViraNumero(PAGE_PADRAO)
  @IsInt({ message: 'page deve ser um número inteiro' })
  @Min(1, { message: 'page deve ser maior ou igual a 1' })
  page: number = PAGE_PADRAO;

  @ApiPropertyOptional({
    example: 20,
    default: LIMITE_PADRAO,
    minimum: 1,
    maximum: 100,
    description: 'Quantidade de itens por página.',
  })
  @vazioViraNumero(LIMITE_PADRAO)
  @IsInt({ message: 'limit deve ser um número inteiro' })
  @Min(1, { message: 'limit deve ser maior ou igual a 1' })
  @Max(100, { message: 'limit deve ser no máximo 100' })
  limit: number = LIMITE_PADRAO;
}
