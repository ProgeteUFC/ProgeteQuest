import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { UserInfoDto } from './userInfo.response.dto';

export class TopicResponseDto {
  topicId!: string;
  forumId!: string;
  titulo!: string;
  descricao?: string;
  status!: TopicStatus;
  criadoEm!: Date;
  atualizadoEm!: Date;

  // Informações do autor
  autor!: UserInfoDto;

  // Metadados úteis
  postsCount!: number;
  ultimoPostEm?: Date;
}
