import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchClassDto } from './dtos/searchClass.dto';
import { User, UserPayload } from 'src/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Turmas')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Listar todas as turmas',
    description: 'Retorna todas as turmas cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de turmas retornada com sucesso.',
  })
  @Get()
  getAll(@User() user: UserPayload): Promise<Class[]> {
    return this.classService.getAllClasses(user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Criar nova turma',
    description: 'Cria uma nova turma.',
  })
  @ApiBody({
    type: CreateClassDto,
    description: 'Dados para criação da turma',
    examples: {
      exemplo: {
        value: {
          name: 'Turma 1',
          classId: 'uuid-da-turma',
          teacherId: 'uuid-do-professor',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso.' })
  @Post()
  create(
    @Body() newClass: CreateClassDto,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.createClass(newClass, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Regenerar código de ingresso',
    description: 'Gera um novo código de ingresso para a turma.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiResponse({
    status: 200,
    description: 'Código de ingresso regenerado.',
  })
  @Patch(':id/join-code')
  async regenerateJoinCode(
    @Param('id') id: string,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.regenerateJoinCode(id, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Atualizar turma',
    description: 'Atualiza os dados de uma turma existente.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma a ser atualizada' })
  @ApiBody({
    type: UpdateClassDto,
    description: 'Novos dados da turma',
    examples: {
      exemplo: {
        value: {
          name: 'Turma 1',
          classId: 'uuid-da-turma',
          teacherId: 'uuid-do-professor',
          assessmentId: 'uuid-da-avaliacao',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Turma atualizada com sucesso.',
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedClass: UpdateClassDto,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.updateClass(id, updatedClass, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Remover turma',
    description: 'Remove uma turma pelo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma a ser removida' })
  @ApiResponse({
    status: 200,
    description: 'Turma removida com sucesso.',
  })
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserPayload): Promise<void> {
    return this.classService.deleteClass(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Buscar turma por ID',
    description: 'Retorna os dados de uma turma específica.',
  })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiResponse({
    status: 200,
    description: 'Turma encontrada com sucesso.',
  })
  @Get(':id')
  async getById(@Param('id') id: string, @User() user: UserPayload) {
    return this.classService.getClassById(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Pesquisar turmas',
    description: 'Pesquisa turmas com base nos filtros informados.',
  })
  @ApiBody({
    type: SearchClassDto,
    description: 'Filtros para pesquisa de turmas',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado da pesquisa retornado com sucesso.',
  })
  @Post('search')
  async searchClasses(
    @Body() searchDto: SearchClassDto,
    @User() user: UserPayload,
  ) {
    return this.classService.searchClasses(searchDto, user);
  }
}