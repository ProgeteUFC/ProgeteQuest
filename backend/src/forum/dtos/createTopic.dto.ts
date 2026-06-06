import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({
    example: 'Dúvida sobre a atividade de programação',
    description: 'Título do tópico que será exibido na lista do fórum.',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  titulo!: string;

  @ApiPropertyOptional({
    example:
      'Não entendi como entregar a atividade da aula de POO. Alguém pode explicar?',
    description: 'Descrição opcional com mais detalhes sobre o tópico.',
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;
}
