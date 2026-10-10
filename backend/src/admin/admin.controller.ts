import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { CreateManagedUserDto } from './dtos/create-managed-user.dto';
import { DeactivateUserDto } from './dtos/deactivate-user.dto';
import { ListUsersQueryDto } from './dtos/list-users-query.dto';
import { AdminUserListResponseDto } from './dtos/responses/admin-user-list.response.dto';

@ApiTags('Administração')
@ApiBearerAuth('JWT')
@ApiForbiddenResponse({
  description:
    'Token ausente, inválido ou expirado, ou usuário sem perfil de administrador.',
})
@Controller('admin/users')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @Roles('admin')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Cadastrar aluno ou professor',
    description:
      'Exclusivo de administradores. Cria uma conta de aluno ou de professor. Não é possível criar administradores por esta rota.',
  })
  @ApiBody({
    type: CreateManagedUserDto,
    examples: {
      professor: {
        summary: 'Criar professor',
        value: {
          name: 'Carlos Souza',
          email: 'carlos@exemplo.com',
          password: 'senha123',
          type: 'teacher',
          registrationTeacher: '654321',
        },
      },
      estudante: {
        summary: 'Criar aluno',
        value: {
          name: 'Maria Silva',
          email: 'maria@exemplo.com',
          password: 'senha123',
          type: 'student',
          registrationStudent: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou tipo diferente de student/teacher.',
  })
  @ApiResponse({ status: 409, description: 'E-mail ou matrícula já em uso.' })
  async createUser(@Body() createManagedUserDto: CreateManagedUserDto) {
    return this.userService.create(createManagedUserDto);
  }

  @Roles('admin')
  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({
    summary: 'Listar e pesquisar usuários',
    description:
      'Exclusivo de administradores. Lista usuários com paginação, filtro por perfil e status, e busca parcial por nome, e-mail, matrícula de aluno ou SIAPE de professor. A senha nunca é retornada. Sem o filtro de status, retorna ativos e inativos.',
  })
  @ApiOkResponse({
    type: AdminUserListResponseDto,
    description: 'Página de usuários encontrados.',
  })
  @ApiBadRequestResponse({
    description:
      'Parâmetros de consulta inválidos ou não reconhecidos (page, limit, type, status ou search).',
  })
  async listUsers(
    @Query() query: ListUsersQueryDto,
  ): Promise<AdminUserListResponseDto> {
    return this.adminService.findUsers(query);
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
  async activate(@Param('id') id: string) {
    return this.userService.activate(id);
  }
}
