import { TopicResponseDto } from './topic.response.dto';
import { PaginationMetaDto } from './pagination.response.dto';

export class TopicListResponseDto {
  data!: TopicResponseDto[];
  meta!: PaginationMetaDto;
}
