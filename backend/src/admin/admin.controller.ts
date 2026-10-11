
import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseUUIDPipe,
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
} from '@nestjs/swagger';

import { Roles } from 'src/decorators/roles.decorator';
import { UserService } from 'src/user/user.service';
import { CreateUserByAdminDto } from './dtos/createUserByAdmin.dto';
import { AdminDashboardService } from './admin-dashboard.service';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UpdateManagedUserDto } from './dtos/update-managed-user.dto';
import { DeactivateUserDto } from './dtos/deactivate-user.dto';

@ApiTags('Administração')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly dashboardService: AdminDashboardService,
  ) {}

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Get('users')
  @ApiOperation({ summary: 'Listar usuários para administração' })
  listUsers() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Get('users/:id/deletion-impact')
  @ApiOperation({ summary: 'Consultar impacto da exclusão sem excluir dados' })
  deletionImpact(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getDeletionImpact(id);
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Get('users/:id')
  @ApiOperation({ summary: 'Visualizar dados administrativos do usuário' })
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOneForAdmin(id);
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Patch('users/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Editar usuário sem alterar seu perfil ou senha' })
  @ApiBody({ type: UpdateManagedUserDto })
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateManagedUserDto) {
    return this.userService.update(id, body);
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Patch('users/:id/deactivate')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Desativar usuário preservando seus vínculos' })
  @ApiBody({ type: DeactivateUserDto })
  deactivateUser(@Param('id', ParseUUIDPipe) id: string, @Body() body: DeactivateUserDto, @User() admin: UserPayload) {
    return this.userService.deactivate(id, admin.userId, body.reason.trim());
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Reativar usuário' })
  activateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.activate(id);
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiForbiddenResponse({
    description: 'Token ausente, inválido ou sem perfil de administrador.',
  })
  @Get('dashboard')
  @ApiOperation({
    summary: 'Consultar indicadores do dashboard administrativo',
    description:
      'Retorna os totais de alunos e professores ativos/inativos, o total de turmas e os cinco usuários desativados mais recentemente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Indicadores retornados com sucesso.',
  })
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiForbiddenResponse({
    description: 'Token ausente, inválido ou sem perfil de administrador.',
  })
  @Post('users')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({
    summary: 'Cadastrar aluno ou professor',
    description:
      'Exclusivo de administradores. Cria uma conta de aluno ou de professor. Não é possível criar administradores por esta rota.',
  })
  @ApiBody({
    type: CreateUserByAdminDto,
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
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou tipo diferente de student/teacher.',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail ou matrícula já em uso.',
  })
  async createUser(
    @Body() createUserByAdminDto: CreateUserByAdminDto,
  ) {
    return this.userService.create(createUserByAdminDto);
  }
}
