import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateCheckinDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da atividade.',
    format: 'uuid',
  })
  @IsUUID()
  activityId: string;

  @ApiProperty({
    example: 'ABC123',
    description: 'Código de check-in informado pelo professor.',
  })
  @ValidateIf((dto: CreateCheckinDto) => !dto.codeId || dto.code !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'Informe um código válido.' })
  code: string;

  @ApiPropertyOptional({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    description: 'ID do estudante (utilizado apenas por administradores)',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    example: '6ba7b811-9dad-41d1-80b4-00c04fd430c8',
    description: 'Compatibilidade com integrações administrativas antigas',
  })
  @IsOptional()
  @IsUUID()
  codeId?: string;
}
