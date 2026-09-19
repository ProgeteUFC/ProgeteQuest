import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeDto {
  @ApiProperty({ example: '2030-05-10T23:59:59.000Z', description: 'Data e hora de expiração do código.', format: 'date-time' })
  validity: string;

  @ApiProperty({ example: 100, description: 'Pontuação concedida pelo check-in.', minimum: 0 })
  score: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da atividade relacionada.', format: 'uuid' })
  activityId: string;
}
