import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID do usuário autor.',
  })
  userId!: string;

  @ApiProperty({ example: 'Maria Silva', description: 'Nome do autor.' })
  name!: string;

  @ApiProperty({
    example: 'maria@exemplo.com',
    description: 'Email do autor.',
  })
  email!: string;
}
