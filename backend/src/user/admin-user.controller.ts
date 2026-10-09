import {
  Body,
  Controller,
  Param,
  Patch,
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UserService } from './user.service';
import { DeactivateUserDto } from './dtos/deactivateUser.dto';
import { UpdateUserByAdminDto } from './dtos/updateUserByAdmin.dto';

@ApiTags('Administração de Usuários')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
  description: 'Token ausente, inválido ou expirado.',
})
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Editar usuário',
    description:
      'Exclusivo de administradores. Edita nome, e-mail, senha e matrícula/SIAPE conforme o perfil do usuário (aluno: registrationStudent; professor: registrationTeacher). A senha é criptografada. Não é possível alterar o tipo do usuário (ex.: student para teacher). A atualização ocorre em transação: se qualquer validação falhar, nada é alterado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser editado',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateUserByAdminDto,
    examples: {
      dadosBasicos: {
        summary: 'Editar nome e e-mail',
        value: { name: 'Maria Silva', email: 'maria@exemplo.com' },
      },
      redefinirSenha: {
        summary: 'Redefinir senha',
        value: { password: 'novaSenha123' },
      },
      matriculaAluno: {
        summary: 'Editar matrícula de aluno',
        value: { registrationStudent: '654321' },
      },
      siapeProfessor: {
        summary: 'Editar SIAPE de professor',
        value: { registrationTeacher: '123456' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    schema: {
      example: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        type: 'student',
        registrationStudent: '654321',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Nenhum campo informado, dado inválido, campo não permitido (ex.: type), matrícula incompatível com o perfil ou usuário não encontrado.',
  })
  @ApiConflictResponse({
    description: 'E-mail, matrícula ou SIAPE já em uso por outro usuário.',
  })
  @ApiForbiddenResponse({
    description: 'Usuário autenticado não é administrador.',
  })
  async update(@Param('id') id: string, @Body() body: UpdateUserByAdminDto) {
    return this.userService.updateByAdmin(id, body);
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
