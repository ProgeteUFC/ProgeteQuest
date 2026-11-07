import { ApiProperty } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

/**
 * Formato do impacto, derivado da própria consulta que o produz. Amarrar o
 * tipo a `getDeletionImpact` evita que a resposta e a consulta de impacto
 * descrevam coisas diferentes com o tempo: mudou lá, muda aqui.
 */
export type DeletionImpact = Awaited<
  ReturnType<UserService['getDeletionImpact']>
>;

/**
 * Resultado da checagem de regras da exclusão definitiva.
 *
 * Nesta sprint o endpoint só valida: `executed` é sempre `false` e nenhum
 * registro é apagado. O front pode montar o fluxo completo de confirmação
 * contra este contrato — quando a exclusão transacional entrar, o que muda é
 * o valor de `executed`, não o formato da resposta.
 */
export class PermanentDeletionClearanceResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Usuário que passou por todas as regras de exclusão.',
    format: 'uuid',
  })
  userId!: string;

  @ApiProperty({
    example: false,
    description:
      'Se a exclusão foi de fato executada. Sempre false enquanto a exclusão transacional não estiver implementada.',
  })
  executed!: boolean;

  @ApiProperty({
    example: '2026-11-07T14:30:00.000Z',
    description: 'Momento em que as regras foram verificadas.',
  })
  validatedAt!: Date;

  @ApiProperty({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    description: 'Administrador que confirmou a operação.',
    format: 'uuid',
  })
  validatedBy!: string;

  @ApiProperty({
    example: 'Conta duplicada, confirmada após revisão dos dados vinculados.',
    description: 'Motivo informado, já sem espaços nas pontas.',
  })
  reason!: string;

  @ApiProperty({
    description:
      'Mesmo payload de GET /admin/users/:id/deletion-impact, recalculado no momento da checagem.',
    example: {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      type: 'teacher',
      // Resumo por perfil; os contadores planos abaixo continuam vindo todos.
      impact: {
        classes: 0,
        assessments: 0,
        activities: 0,
        enrollments: 0,
        checkins: 0,
        forums: 0,
        topics: 0,
        posts: 0,
      },
      classesAsStudent: 0,
      classesAsTeacher: 0,
      activities: 0,
      assessments: 0,
      checkins: 0,
      forumTopics: 0,
      forumPosts: 0,
      enrollments: 0,
      forums: 0,
      codes: 0,
      hasDependencies: false,
      canDelete: true,
      blockedReasons: [],
    },
  })
  impact!: DeletionImpact;

  @ApiProperty({
    example:
      'Regras aprovadas. A exclusão transacional será executada quando for implementada.',
    description: 'O que ainda falta acontecer para o usuário sumir de fato.',
  })
  pendingStep!: string;
}
