import { ApiProperty } from '@nestjs/swagger';

export class TransferredClassDto {
  @ApiProperty({ example: '3f0d9f1e-8b7a-4d1c-9a2b-5c6d7e8f9a0b' })
  classId: string;

  @ApiProperty({ example: 'Algoritmos I - 2026.1' })
  name: string;
}

export class PreservedRelationsDto {
  @ApiProperty({ example: 32, description: 'Matrículas mantidas nas turmas.' })
  enrollments: number;

  @ApiProperty({ example: 4, description: 'Avaliações mantidas nas turmas.' })
  assessments: number;

  @ApiProperty({ example: 12, description: 'Atividades mantidas nas turmas.' })
  activities: number;

  @ApiProperty({ example: 2, description: 'Fóruns mantidos nas turmas.' })
  forums: number;
}

export class TransferClassesResponseDto {
  @ApiProperty({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8' })
  sourceTeacherId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  destinationTeacherId: string;

  @ApiProperty({ type: [TransferredClassDto] })
  transferredClasses: TransferredClassDto[];

  @ApiProperty({
    type: PreservedRelationsDto,
    description:
      'Contagem dos vínculos acadêmicos das turmas, conferida depois da transferência: a operação só é confirmada se nada tiver sido perdido.',
  })
  preservedRelations: PreservedRelationsDto;

  @ApiProperty({ example: '2026-10-23T14:12:00.000Z' })
  transferredAt: Date;
}
