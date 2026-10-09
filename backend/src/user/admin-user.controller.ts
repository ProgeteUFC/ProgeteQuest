import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UserService } from './user.service';
import { DeactivateUserDto } from './dtos/deactivateUser.dto';
import { AdminUpdateUserDto } from './dtos/adminUpdateUser.dto';

@ApiTags('Administração de Usuários')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado.',
})
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Listar usuários para administração' })
  async list() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Consultar usuário para administração' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOneForAdmin(id);
  }

  @Roles('admin')
  @Get(':id/deletion-impact')
  @ApiOperation({ summary: 'Consultar impacto potencial da exclusão' })
  async getDeletionImpact(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.getDeletionImpact(id);
  }

  @Roles('admin')
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({ summary: 'Editar usuário sem alterar seu perfil' })
  @ApiBody({ type: AdminUpdateUserDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AdminUpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Roles('admin')
  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desativar usuário',
    description:
      'Desativa um usuário sem apagar seus dados ou relações. Apenas administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser desativado',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: DeactivateUserDto })
  @ApiOkResponse({
    description:
      'Usuário desativado com sucesso (ou já estava inativo — idempotente).',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'inactive',
        deactivatedAt: '2026-10-03T20:00:00.000Z',
        deactivatedBy: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        deactivationReason: 'Professor desligado da instituição',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Usuário não encontrado, é o último administrador ativo, ou o admin tentou desativar a própria conta.',
  })
  @ApiForbiddenResponse({
    description: 'Usuário autenticado não é administrador.',
  })
  async deactivate(
    @Param('id') id: string,
    @Body() body: DeactivateUserDto,
    @User() admin: UserPayload,
  ) {
    return this.userService.deactivate(id, admin.userId, body.reason);
  }

  @Roles('admin')
  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Ativar usuário',
    description:
      'Reativa um usuário previamente desativado. Apenas administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser ativado',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description:
      'Usuário ativado com sucesso (ou já estava ativo — idempotente).',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'active',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Usuário não encontrado',
  })
  @ApiForbiddenResponse({
    description: 'Usuário autenticado não é administrador.',
  })
  async activate(@Param('id') id: string) {
    return this.userService.activate(id);
  }
}
