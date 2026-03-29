import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { TopicStatus } from 'src/Enums/topicStatus.enum';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsUUID()
  forumId: string;

  @IsNotEmpty()
  @IsUUID()
  autorId: string;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsEnum(TopicStatus)
  status?: TopicStatus;
}
