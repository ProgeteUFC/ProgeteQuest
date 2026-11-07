import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const PAGE_PADRAO = 1;
const LIMITE_PADRAO = 20;

const vazioViraNumero = (padrao: number) =>
  Transform(({ value }: { value: unknown }) =>
    value === undefined || value === null || value === ''
      ? padrao
      : Number(value),
  );

export class ListAuditLogsQueryDto {
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
    example: 10,
    default: LIMITE_PADRAO,
    minimum: 1,
    maximum: 100,
    description: 'Quantidade de registros por página.',
  })
  @vazioViraNumero(LIMITE_PADRAO)
  @IsInt({ message: 'limit deve ser um número inteiro' })
  @Min(1, { message: 'limit deve ser maior ou igual a 1' })
  @Max(100, { message: 'limit deve ser no máximo 100' })
  limit: number = LIMITE_PADRAO;
}
