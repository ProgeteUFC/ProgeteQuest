import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { UserInfoDto } from './userInfo.response.dto';

export class TopicResponseDto {
  @ApiProperty({
    example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
    description: 'ID do tópico.',
  })
  topicId!: string;

  @ApiProperty({
    example: 'f1e2d3c4-b5a6-7890-cdef-ab1234567890',
    description: 'ID do fórum ao qual o tópico pertence.',
  })
  forumId!: string;

  @ApiProperty({
    example: 'Dúvida sobre a atividade de programação',
    description: 'Título do tópico.',
  })
  titulo!: string;

  @ApiPropertyOptional({
    example:
      'Não entendi como entregar a atividade da aula 3. Alguém pode explicar?',
    description: 'Descrição opcional do tópico.',
  })
  descricao?: string;

  @ApiProperty({
    enum: TopicStatus,
    enumName: 'TopicStatus',
    example: TopicStatus.OPEN,
    description: 'Status do tópico.',
  })
  status!: TopicStatus;

  @ApiProperty({
    example: '2026-06-06T17:30:00.000Z',
    description: 'Data de criação do tópico.',
  })
  criadoEm!: Date;

  @ApiProperty({
    example: '2026-06-06T17:45:00.000Z',
    description: 'Data da última atualização do tópico.',
  })
  atualizadoEm!: Date;

  @ApiProperty({ type: UserInfoDto, description: 'Informações do autor.' })
  autor!: UserInfoDto;

  @ApiProperty({
    example: 4,
    description: 'Quantidade de postagens dentro do tópico.',
  })
  postsCount!: number;

  @ApiPropertyOptional({
    example: '2026-06-06T17:45:00.000Z',
    description: 'Data da última postagem do tópico.',
  })
  ultimoPostEm?: Date;
}
