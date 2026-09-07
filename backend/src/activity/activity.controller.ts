import { Controller, Delete, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dtos/createActivity.dto';
import { Activity } from './entities/activity.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchActivityDto } from './dtos/searchActivity.dto';
import { UpdateActivityDto } from './dtos/updateActivity.dto';
import { User, UserPayload } from 'src/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Atividades')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Listar todas as atividades',
    description: 'Retorna todas as atividades cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atividades retornada com sucesso.',
  })
  @Get()
  getAll(@User() user: UserPayload): Promise<Activity[]> {
    return this.activityService.getAllActivities(user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Criar nova atividade',
    description: 'Cria uma nova atividade para uma turma.',
  })
  @ApiBody({
    type: CreateActivityDto,
    description: 'Dados para criação da atividade',
    examples: {
      exemplo: {
        value: {
          name: 'Seminário de Matemática',
          date: '2024-05-10T00:00:00Z',
          type: 'seminar',
          classId: 'uuid-da-turma',
          assessmentId: 'uuid-da-avaliacao',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Atividade criada com sucesso.',
  })
  @Post()
  create(
    @Body() newActivity: CreateActivityDto,
    @User() user: UserPayload,
  ): Promise<Activity> {
    return this.activityService.createActivity(newActivity, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Atualizar atividade',
    description: 'Atualiza os dados de uma atividade existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da atividade a ser atualizada',
  })
  @ApiBody({
    type: UpdateActivityDto,
    description: 'Novos dados da atividade',
    examples: {
      exemplo: {
        value: {
          name: 'Seminário de Matemática',
          date: '2024-05-10T00:00:00Z',
          type: 'seminar',
          classId: 'uuid-da-turma',
          assessmentId: 'uuid-da-avaliacao',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Atividade atualizada com sucesso.',
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedActivity: UpdateActivityDto,
    @User() user: UserPayload,
  ): Promise<Activity> {
    return this.activityService.updateActivity(id, updatedActivity, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Remover atividade',
    description: 'Remove uma atividade pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da atividade a ser removida',
  })
  @ApiResponse({
    status: 200,
    description: 'Atividade removida com sucesso.',
  })
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @User() user: UserPayload,
  ): Promise<Activity[]> {
    return this.activityService.deleteActivity(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Buscar atividades',
    description: 'Busca atividades por critérios como nome, turma ou avaliação.',
  })
  @ApiBody({
    type: SearchActivityDto,
    description: 'Critérios de busca',
    examples: {
      exemplo: {
        value: {
          name: 'Prova',
          classId: 'uuid-da-turma',
          assessmentId: 'uuid-da-avaliacao',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Atividades encontradas.',
  })
  @Post('search')
  async searchActivities(
    @Body() searchDto: SearchActivityDto,
    @User() user: UserPayload,
  ) {
    return this.activityService.searchActivities(searchDto, user);
  }

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Listar atividades por turma',
    description: 'Lista todas as atividades de uma turma específica.',
  })
  @ApiParam({
    name: 'classId',
    description: 'ID da turma',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atividades da turma.',
  })
  @Get('class/:classId')
  async listByClass(
    @Param('classId') classId: string,
    @User() user: UserPayload,
  ): Promise<Activity[]> {
    return this.activityService.listActivitiesByClass(
      classId,
      'date',
      'ASC',
      user.userId,
      user,
    );
  }
}
