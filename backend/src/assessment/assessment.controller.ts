import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dtos/createAssessment.dto';
import { Assessment } from './entities/assessment.entity';
import { UpdateAssessmentDto } from './dtos/updateAssessment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Avaliações')
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Listar todas as avaliações',
    description: 'Retorna todas as avaliações cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações retornada com sucesso.',
  })
  @Get()
  getAll(@User() user: UserPayload): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessments(user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Criar nova avaliação',
    description: 'Cria uma nova avaliação para uma turma.',
  })
  @ApiBody({
    type: CreateAssessmentDto,
    description: 'Dados para criação da avaliação',
    examples: {
      exemplo: {
        value: {
          name: 'Avaliação 1',
          classId: 'uuid-da-turma',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso.',
  })
  @Post()
  create(
    @Body() newAssessment: CreateAssessmentDto,
    @User() user: UserPayload,
  ): Promise<Assessment> {
    return this.assessmentService.createAssessment(newAssessment, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Atualizar avaliação',
    description: 'Atualiza os dados de uma avaliação existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da avaliação a ser atualizada',
  })
  @ApiBody({
    type: UpdateAssessmentDto,
    description: 'Novos dados da avaliação',
    examples: {
      exemplo: {
        value: {
          name: 'Avaliação 1',
          classId: 'uuid-da-turma',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avaliação atualizada com sucesso.',
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedAssessment: UpdateAssessmentDto,
    @User() user: UserPayload,
  ): Promise<Assessment> {
    return this.assessmentService.updateAssessment(id, updatedAssessment, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Remover avaliação',
    description: 'Remove uma avaliação pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da avaliação a ser removida',
  })
  @ApiResponse({
    status: 200,
    description: 'Avaliação removida com sucesso.',
  })
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserPayload): Promise<void> {
    return this.assessmentService.deleteAssessment(id, user);
  }
}