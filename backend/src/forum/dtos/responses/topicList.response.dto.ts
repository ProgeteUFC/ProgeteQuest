import { ApiProperty } from '@nestjs/swagger';
import { TopicResponseDto } from './topic.response.dto';
import { PaginationMetaDto } from './pagination.response.dto';

export class TopicListResponseDto {
  @ApiProperty({
    type: [TopicResponseDto],
    description: 'Tópicos encontrados no fórum.',
  })
  data!: TopicResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Dados de paginação.' })
  meta!: PaginationMetaDto;
}
