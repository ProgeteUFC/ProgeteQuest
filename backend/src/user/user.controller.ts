import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { LegacyRegisterStudentDto } from './dtos/legacyRegisterStudent.dto';
import { UserType } from 'src/Enums/user.enum';
import { UserService } from './user.service';
import { DeleteUserDto } from './dtos/deleteUser.dto';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({
    summary: '[Descontinuada] Cadastrar-se como aluno',
    deprecated: true,
    description:
      'Mantida apenas enquanto o frontend não migra para POST /auth/register/student, que é a rota oficial. Cria exclusivamente contas de aluno: o tipo é definido pelo servidor e tentar se cadastrar como professor ou administrador resulta em 400.',
  })
  @ApiBody({ type: LegacyRegisterStudentDto })
  @ApiResponse({ status: 201, description: 'Aluno cadastrado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou tentativa de cadastrar não-aluno.',
  })
  @ApiResponse({ status: 409, description: 'E-mail ou matrícula já em uso.' })
  async createStudent(@Body() body: LegacyRegisterStudentDto) {
    // Mesma garantia da rota nova: o tipo vem do servidor, não do cliente.
    return this.userService.create({
      ...body,
      type: UserType.STUDENT,
    });
  }

  @Roles('teacher')
  @ApiBearerAuth('JWT')
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna todos os usuários cadastrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Roles('teacher', 'student')
  @ApiBearerAuth('JWT')
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
  @Put()
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados do usuário autenticado.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Novos dados do usuário',
    examples: {
      atualizarDadosBasicos: {
        summary: 'Atualizar dados básicos',
        value: {
          name: 'Maria Silva',
          email: 'maria@exemplo.com',
          password: 'novaSenha123',
        },
      },
      atualizarMatriculaAluno: {
        summary: 'Atualizar matrícula de aluno',
        value: {
          registrationStudent: '654321',
        },
      },
      atualizarMatriculaProfessor: {
        summary: 'Atualizar matrícula de professor',
        value: {
          registrationTeacher: '123456',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserPayload,
  ) {
    return this.userService.update(user.userId, updateUserDto);
  }

  @Roles('teacher', 'student')
  @ApiBearerAuth('JWT')
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
  @Post('delete')
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove o usuário autenticado (requer senha).',
  })
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  async remove(@User() user: UserPayload, @Body() body: DeleteUserDto) {
    return this.userService.remove(user.userId, body.password);
  }

  @Roles('teacher', 'student')
  @ApiBearerAuth('JWT')
  @ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário pelo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
