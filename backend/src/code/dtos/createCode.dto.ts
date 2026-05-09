import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeDto {
  @ApiProperty({ example: 'ABC123', description: 'Código gerado para a atividade' })
  code: string;

  @ApiProperty({ example: '2024-05-10T23:59:59Z', description: 'Validade do código (data/hora ISO)' })
  validity: string;

  @ApiProperty({ example: true, description: 'Se o código está ativo' })
  active: boolean;

  @ApiProperty({ example: 10, description: 'Pontuação associada ao código' })
  score: number;

  @ApiProperty({ example: 'uuid-da-atividade', description: 'ID da atividade relacionada' })
  activityId: string;
}
