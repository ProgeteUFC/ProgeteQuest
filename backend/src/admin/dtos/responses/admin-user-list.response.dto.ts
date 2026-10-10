import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/common/dtos/pagination.response.dto';
import { AdminUserResponseDto } from './admin-user.response.dto';

export class AdminUserListResponseDto {
  @ApiProperty({
    type: [AdminUserResponseDto],
    description: 'Usuários encontrados na página solicitada.',
  })
  data!: AdminUserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto, description: 'Dados de paginação.' })
  meta!: PaginationMetaDto;
}
