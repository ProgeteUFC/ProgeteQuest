import { UserInfoDto } from './userInfo.response.dto';

export class PostResponseDto {
  postId!: string;
  mensagem!: string;
  topicId!: string;
  criadoEm!: Date;
  atualizadoEm!: Date;

  // Informações do autor
  autor!: UserInfoDto;
}
