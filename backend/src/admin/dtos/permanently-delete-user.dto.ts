import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Equals, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Frase que o administrador precisa digitar para confirmar a exclusão
 * definitiva. Exportada porque o front usa exatamente este texto na tela de
 * confirmação e os testes usam a mesma constante — a frase existe em um lugar
 * só, e mudá-la não deixa cliente e servidor em desacordo.
 */
export const CONFIRMATION_PHRASE = 'EXCLUIR DEFINITIVAMENTE';

/** Tamanho máximo do motivo, igual ao da desativação. */
const MAX_REASON_LENGTH = 500;

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class PermanentlyDeleteUserDto {
  @ApiProperty({
    example: CONFIRMATION_PHRASE,
    enum: [CONFIRMATION_PHRASE],
    description: `Frase de confirmação. Precisa ser exatamente "${CONFIRMATION_PHRASE}", em caixa alta. Espaços ao redor são ignorados.`,
  })
  // Só os espaços das pontas são descartados: digitar em caixa baixa ou
  // abreviar continua sendo recusado, que é o motivo de existir a frase.
  @Transform(trim)
  @IsString({ message: 'A confirmação deve ser um texto' })
  @Equals(CONFIRMATION_PHRASE, {
    message: `Digite exatamente "${CONFIRMATION_PHRASE}" para confirmar`,
  })
  confirmation!: string;

  @ApiProperty({
    example: 'Conta duplicada, confirmada após revisão dos dados vinculados.',
    maxLength: MAX_REASON_LENGTH,
    description: 'Motivo da exclusão definitiva. Fica registrado na auditoria.',
  })
  @Transform(trim)
  @IsString({ message: 'O motivo deve ser um texto' })
  @IsNotEmpty({ message: 'O motivo da exclusão é obrigatório' })
  @MaxLength(MAX_REASON_LENGTH, {
    message: `O motivo deve ter no máximo ${MAX_REASON_LENGTH} caracteres`,
  })
  reason!: string;

  @ApiProperty({
    example: 'senha-do-administrador',
    format: 'password',
    description:
      'Senha do administrador autenticado, usada para reconfirmar quem está no comando da operação. Nunca é registrada em log nem devolvida na resposta.',
  })
  // Sem `@Transform(trim)`: espaços podem fazer parte da senha, e recortá-los
  // recusaria uma senha correta.
  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha do administrador é obrigatória' })
  adminPassword!: string;
}
