import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckinDto {
  @ApiProperty({ example: 'uuid-da-atividade', description: 'ID da atividade' })
  activityId: string;

  @ApiProperty({ example: 'ABC123', description: 'Código informado pelo aluno' })
  code: string;

  @ApiPropertyOptional({
    example: 'uuid-do-estudante',
    description: 'ID do estudante (utilizado apenas por administradores)',
  })
  studentId?: string;

  @ApiPropertyOptional({
    example: 'uuid-do-codigo',
    description: 'Compatibilidade com integrações administrativas antigas',
  })
  codeId?: string;
}
