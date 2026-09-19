import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckinDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da atividade.', format: 'uuid' })
  activityId: string;

  @ApiProperty({ example: 'ABC123', description: 'Código de check-in informado pelo professor.' })
  code: string;

  @ApiPropertyOptional({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    description: 'ID do estudante (utilizado apenas por administradores)',
  })
  studentId?: string;

  @ApiPropertyOptional({
    example: '6ba7b811-9dad-41d1-80b4-00c04fd430c8',
    description: 'Compatibilidade com integrações administrativas antigas',
  })
  codeId?: string;
}
