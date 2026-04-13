import { PostResponseDto } from './post.response.dto';
import { PaginationMetaDto } from './pagination.response.dto';

export class PostListResponseDto {
  data!: PostResponseDto[];
  meta!: PaginationMetaDto;
}
