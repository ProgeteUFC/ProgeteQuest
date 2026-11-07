import { ApiProperty } from '@nestjs/swagger';
import { AuditAction } from 'src/Enums/audit-action.enum';
import { PaginationMetaDto } from 'src/common/dtos/pagination.response.dto';

export class AuditLogUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'ID do usuário. Para usuários já excluídos, é o ID preservado na auditoria.',
  })
  userId!: string;

  @ApiProperty({
    example: 'Ana',
    nullable: true,
    type: String,
    description: 'Nome do usuário, ou null se ele já foi excluído.',
  })
  name!: string | null;

  @ApiProperty({
    example: 'ana@email.com',
    nullable: true,
    type: String,
    description: 'E-mail do usuário, ou null se ele já foi excluído.',
  })
  email!: string | null;
}

export class AuditLogResponseDto {
  @ApiProperty({ example: '7c9e6679-7425-40de-944b-e07fc1f90ae7' })
  auditId!: string;

  @ApiProperty({ enum: AuditAction, example: AuditAction.USER_DEACTIVATED })
  action!: AuditAction;

  @ApiProperty({ example: '2026-11-02T09:40:00.000Z' })
  createdAt!: Date;

  @ApiProperty({
    example: 'Professor desligado da instituição.',
    nullable: true,
    type: String,
  })
  reason!: string | null;

  @ApiProperty({
    example: { status: { before: 'active', after: 'inactive' } },
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Alterações relevantes da operação.',
  })
  changes!: Record<string, unknown> | null;

  @ApiProperty({
    example: { userId: '550e8400-e29b-41d4-a716-446655440000' },
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'IDs dos recursos envolvidos na operação.',
  })
  resourceIds!: Record<string, unknown> | null;

  @ApiProperty({
    type: AuditLogUserDto,
    description: 'Administrador responsável pela operação.',
  })
  admin!: AuditLogUserDto;

  @ApiProperty({ type: AuditLogUserDto, description: 'Usuário afetado.' })
  targetUser!: AuditLogUserDto;
}

export class AuditLogListResponseDto {
  @ApiProperty({
    type: [AuditLogResponseDto],
    description:
      'Registros da página solicitada, do mais recente ao mais antigo.',
  })
  data!: AuditLogResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Dados de paginação.' })
  meta!: PaginationMetaDto;
}