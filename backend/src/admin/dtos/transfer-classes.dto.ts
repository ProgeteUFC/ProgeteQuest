import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

const MAX_TURMAS_POR_TRANSFERENCIA = 100;

export class TransferClassesDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'ID do professor que passará a responder pelas turmas. Precisa existir, ter perfil de professor e estar ativo.',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'O professor de destino é obrigatório' })
  @IsUUID('all', {
    message: 'O ID do professor de destino deve ser um UUID válido',
  })
  destinationTeacherId!: string;

  @ApiProperty({
    type: [String],
    example: [
      '3f0d9f1e-8b7a-4d1c-9a2b-5c6d7e8f9a0b',
      '7c1e2d3f-4a5b-4c6d-8e9f-0a1b2c3d4e5f',
    ],
    description:
      'IDs das turmas a transferir. Todas precisam pertencer ao professor de origem.',
    maxItems: MAX_TURMAS_POR_TRANSFERENCIA,
  })
  @IsArray({ message: 'classIds deve ser uma lista' })
  @ArrayNotEmpty({ message: 'Informe ao menos uma turma para transferir' })
  @ArrayUnique({ message: 'classIds não pode repetir a mesma turma' })
  @ArrayMaxSize(MAX_TURMAS_POR_TRANSFERENCIA, {
    message: `Transfira no máximo ${MAX_TURMAS_POR_TRANSFERENCIA} turmas por requisição`,
  })
  @IsUUID('all', {
    each: true,
    message: 'Cada ID de turma deve ser um UUID válido',
  })
  classIds!: string[];
}
