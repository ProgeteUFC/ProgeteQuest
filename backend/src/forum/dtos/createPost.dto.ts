import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Também tive essa dúvida. A entrega é pelo menu de atividades.',
    description: 'Mensagem da resposta que será publicada no tópico.',
  })
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  @IsString({ message: 'Mensagem deve ser uma string' })
  mensagem!: string;
}
