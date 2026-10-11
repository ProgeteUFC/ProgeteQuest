import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from 'src/Enums/user.enum';

export class AdminUserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador do usuário.',
  })
  userId!: string;

  @ApiProperty({ example: 'Maria Silva', description: 'Nome do usuário.' })
  name!: string;

  @ApiProperty({
    example: 'maria@exemplo.com',
    description: 'E-mail do usuário.',
  })
  email!: string;

  @ApiProperty({
    enum: UserType,
    example: UserType.STUDENT,
    description: 'Perfil do usuário.',
  })
  type!: UserType;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Status da conta.',
  })
  status!: UserStatus;

  @ApiProperty({
    type: String,
    example: '123456',
    nullable: true,
    description:
      'Matrícula do aluno ou SIAPE do professor, conforme o perfil. Nulo para administradores.',
  })
  registration!: string | null;

  @ApiProperty({
    example: '2026-10-01T12:00:00.000Z',
    description: 'Data de criação da conta.',
  })
  createdAt!: Date;
}
