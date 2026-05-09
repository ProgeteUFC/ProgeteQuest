import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Códigos')
@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo código', description: 'Cria um novo código para uma atividade.' })
  @ApiBody({ type: CreateCodeDto, description: 'Dados para criação do código', examples: { exemplo: { value: { code: 'ABC123', validity: '2024-05-10T23:59:59Z', active: true, score: 10, activityId: 'uuid-da-atividade' } } } })
  @ApiResponse({ status: 201, description: 'Código criado com sucesso.' })
  async create(@Body() dto: CreateCodeDto) {
    return this.codeService.createCode(dto);
  }

  @Roles('teacher')
  @Patch(':id/invalidate')
  @ApiOperation({ summary: 'Invalidar código', description: 'Invalida um código pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID do código a ser invalidado' })
  @ApiResponse({ status: 200, description: 'Código invalidado com sucesso.' })
  async invalidate(@Param('id') id: string) {
    return this.codeService.invalidateCode(id);
  }

  @Roles('teacher')
  @Patch(':id/renew')
  @ApiOperation({ summary: 'Renovar código', description: 'Renova um código pelo ID.' })
  @ApiParam({ name: 'id', description: 'ID do código a ser renovado' })
  @ApiResponse({ status: 200, description: 'Código renovado com sucesso.' })
  async renew(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.renewCode(id, user.userId);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Listar códigos por atividade', description: 'Lista todos os códigos de uma atividade.' })
  @ApiParam({ name: 'activityId', description: 'ID da atividade' })
  @ApiResponse({ status: 200, description: 'Lista de códigos da atividade.' })
  async listByActivity(@Param('activityId') activityId: string) {
    return this.codeService.listCodesByActivity(activityId);
  }
}
