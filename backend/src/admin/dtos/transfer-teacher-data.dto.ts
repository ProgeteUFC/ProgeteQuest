import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferTeacherDataDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do professor que receberá os dados transferidos.',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'O professor de destino é obrigatório' })
  @IsUUID('all', { message: 'O ID do professor de destino deve ser um UUID válido' })
  targetTeacherId!: string;
}
