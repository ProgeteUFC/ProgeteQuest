import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Página atual.' })
  page!: number;

  @ApiProperty({ example: 10, description: 'Quantidade de itens por página.' })
  limit!: number;

  @ApiProperty({ example: 25, description: 'Total de itens encontrados.' })
  totalItems!: number;

  @ApiProperty({ example: 3, description: 'Total de páginas disponíveis.' })
  totalPages!: number;
}
