import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateCodeDto {
  @ApiProperty({ example: '2030-05-10T23:59:59.000Z', description: 'Data e hora de expiração do código.', format: 'date-time' })
  @IsDateString({}, { message: 'A validade deve estar no formato ISO 8601.' })
  validity: string;

  @ApiProperty({ example: 100, description: 'Pontuação concedida pelo check-in.', minimum: 0 })
  @IsInt({ message: 'A pontuação deve ser um número inteiro.' })
  @Min(0, { message: 'A pontuação não pode ser negativa.' })
  score: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da atividade relacionada.', format: 'uuid' })
  @IsUUID(undefined, { message: 'activityId deve ser um UUID válido.' })
  activityId: string;
}
