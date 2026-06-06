import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from './userInfo.response.dto';

export class PostResponseDto {
  @ApiProperty({
    example: 'c1d2e3f4-a5b6-7890-cdef-ab1234567890',
    description: 'ID da postagem.',
  })
  postId!: string;

  @ApiProperty({
    example: 'Também tive essa dúvida. A entrega é pelo menu de atividades.',
    description: 'Mensagem publicada no tópico.',
  })
  mensagem!: string;

  @ApiProperty({
    example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
    description: 'ID do tópico ao qual a postagem pertence.',
  })
  topicId!: string;

  @ApiProperty({
    example: '2026-06-06T17:35:00.000Z',
    description: 'Data de criação da postagem.',
  })
  criadoEm!: Date;

  @ApiProperty({
    example: '2026-06-06T17:35:00.000Z',
    description: 'Data da última atualização da postagem.',
  })
  atualizadoEm!: Date;

  @ApiProperty({ type: UserInfoDto, description: 'Informações do autor.' })
  autor!: UserInfoDto;
}
