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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Turmas')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles('teacher', 'student')
  @Get()
  @ApiOperation({ summary: 'Listar todas as turmas', description: 'Retorna todas as turmas cadastradas.' })
  @ApiResponse({ status: 200, description: 'Lista de turmas retornada com sucesso.' })
  getAll(): Promise<Class[]> {
    return this.classService.getAllClasses();
  }

  @Roles('teacher')
  @Post()
  @ApiOperation({ summary: 'Criar nova turma', description: 'Cria uma nova turma.' })
  @ApiBody({ type: CreateClassDto, description: 'Dados para criação da turma', examples: { exemplo: { value: { name: 'Turma 1', classId: 'uuid-da-turma', teacherId: 'uuid-do-professor' } } } })
  @ApiResponse({ status: 201, description: 'Turma criada com sucesso.' })
  create(@Body() newClass: CreateClassDto): Promise<Class> {
    return this.classService.createClass(newClass);
  }

  @Roles('teacher')
  @Patch(':id/join-code')
  @ApiOperation({ summary: 'Regenerar código de ingresso', description: 'Gera um novo código de ingresso para a turma.' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiResponse({ status: 200, description: 'Código de ingresso regenerado.' })
  async regenerateJoinCode(@Param('id') id: string): Promise<Class> {
    return this.classService.regenerateJoinCode(id);
  }

  @Roles('teacher')
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar turma', description: 'Atualiza os dados de uma turma existente.' })
  @ApiParam({ name: 'id', description: 'ID da turma a ser atualizada' })
  @ApiBody({ type: UpdateClassDto, description: 'Novos dados da turma', examples: { exemplo: { value: { name: 'Turma 1', classId: 'uuid-da-turma', teacherId: 'uuid-do-professor', assessmentId: 'uuid-da-avaliacao' } } } })
  @ApiResponse({ status: 200, description: 'Turma atualizada com sucesso.' })
  update(
    @Param('id') id: string,
    @Body() updatedClass: UpdateClassDto,
  ): Promise<Class> {
    return this.classService.updateClass(id, updatedClass);
  }

  @Roles('teacher')
  @Delete(':id')
  @ApiOperation({ summary: 'Remover turma', description: 'Remove uma turma pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID da turma a ser removida' })
  @ApiResponse({ status: 200, description: 'Turma removida com sucesso.' })
  delete(@Param('id') id: string): Promise<void> {
    return this.classService.deleteClass(id);
  }

  @Roles('teacher', 'student')
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.classService.getClassById(id);
  }

  @Roles('teacher', 'student')
  @Post('search')
  async searchClasses(@Body() searchDto: SearchClassDto) {
    return this.classService.searchClasses(searchDto);
  }
}
