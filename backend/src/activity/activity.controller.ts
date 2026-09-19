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
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Atividades')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
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
          name: 'Seminário de Requisitos',
          date: '2030-05-10T23:59:59.000Z',
          type: 'seminar',
          classId: '550e8400-e29b-41d4-a716-446655440000',
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
    description: 'ID da atividade a ser atualizada.',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateActivityDto,
    description: 'Novos dados da atividade',
    examples: {
      exemplo: {
        value: {
          name: 'Seminário de Matemática',
          date: '2030-05-12T23:59:59.000Z',
          type: 'seminar',
          classId: '550e8400-e29b-41d4-a716-446655440000',
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
    description: 'ID da atividade a ser removida.',
    format: 'uuid',
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
    description: 'ID da turma.',
    format: 'uuid',
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
