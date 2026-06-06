import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post.response.dto';
import { PaginationMetaDto } from './pagination.response.dto';

export class PostListResponseDto {
  @ApiProperty({
    type: [PostResponseDto],
    description: 'Postagens encontradas no tópico.',
  })
  data!: PostResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Dados de paginação.' })
  meta!: PaginationMetaDto;
}
