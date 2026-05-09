import { Body, Controller, Delete, Post, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário (aluno ou professor).' })
  @ApiBody({ type: CreateUserDto, description: 'Dados para criação do usuário', examples: { exemplo: { value: { name: 'Maria Silva', email: 'maria@exemplo.com', password: 'senha123', type: 'student', registrationStudent: '123456' } } } })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('teacher')
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna todos os usuários cadastrados.' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Roles('teacher', 'student')
  @Put()
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza os dados do usuário autenticado.' })
  @ApiBody({ description: 'Novos dados do usuário', examples: { exemplo: { value: { name: 'Maria Silva', email: 'maria@exemplo.com', password: 'novaSenha123', registrationStudent: '654321' } } } })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  async update(
    @Body() updateUserDto: Partial<CreateUserDto>,
    @User() user: UserPayload,
  ) {
    return this.userService.update(user.userId, updateUserDto);
  }

  @Roles('teacher', 'student')
  @Post('delete')
  @ApiOperation({ summary: 'Remover usuário', description: 'Remove o usuário autenticado (requer senha).' })
  @ApiBody({ description: 'Senha para confirmação', examples: { exemplo: { value: { password: 'senha123' } } } })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  async remove(@User() user: UserPayload, @Body() body: { password: string }) {
    return this.userService.remove(user.userId, body.password);
  }

  @Roles('teacher', 'student')
  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna os dados de um usuário pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
