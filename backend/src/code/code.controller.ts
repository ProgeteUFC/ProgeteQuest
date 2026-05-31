import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Códigos')
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Criar novo código',
    description: 'Cria um novo código para uma atividade.',
  })
  @ApiBody({
    type: CreateCodeDto,
    description: 'Dados para criação do código',
    examples: {
      exemplo: {
        value: {
          code: 'ABC123',
          validity: '2024-05-10T23:59:59Z',
          active: true,
          score: 10,
          activityId: 'uuid-da-atividade',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Código criado com sucesso.' })
  @Post()
  async create(@Body() dto: CreateCodeDto, @User() user: UserPayload) {
    return this.codeService.createCode(dto, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Invalidar código',
    description: 'Invalida um código pelo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do código a ser invalidado' })
  @ApiResponse({ status: 200, description: 'Código invalidado com sucesso.' })
  @Patch(':id/invalidate')
  async invalidate(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.invalidateCode(id, user);
  }

  @Roles('teacher', 'admin')
  @ApiOperation({
    summary: 'Renovar código',
    description: 'Renova um código pelo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do código a ser renovado' })
  @ApiResponse({ status: 200, description: 'Código renovado com sucesso.' })
  @Patch(':id/renew')
  async renew(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.renewCode(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @ApiOperation({
    summary: 'Listar códigos por atividade',
    description: 'Lista todos os códigos de uma atividade.',
  })
  @ApiParam({ name: 'activityId', description: 'ID da atividade' })
  @ApiResponse({ status: 200, description: 'Lista de códigos da atividade.' })
  @Get('activity/:activityId')
  async listByActivity(
    @Param('activityId') activityId: string,
    @User() user: UserPayload,
  ) {
    return this.codeService.listCodesByActivity(activityId, user);
  }
}