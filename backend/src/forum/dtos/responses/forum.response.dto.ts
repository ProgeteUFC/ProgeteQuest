import { ApiProperty } from '@nestjs/swagger';

export class ForumResponseDto {
  @ApiProperty({
    example: 'f1e2d3c4-b5a6-7890-cdef-ab1234567890',
    description: 'ID do fórum.',
  })
  forumId!: string;

  @ApiProperty({
    example: '9a8b7c6d-5e4f-3210-abcd-ef1234567890',
    description: 'ID da turma vinculada ao fórum.',
  })
  turmaId!: string;

  @ApiProperty({
    example: '2026-06-06T17:00:00.000Z',
    description: 'Data de criação do fórum.',
  })
  criadoEm!: Date;

  @ApiProperty({
    example: '2026-06-06T17:00:00.000Z',
    description: 'Data da última atualização do fórum.',
  })
  atualizadoEm!: Date;
}
