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
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Códigos de check-in')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado.' })
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
    description: 'O valor do código e seu estado ativo são gerados automaticamente.',
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
  @ApiParam({ name: 'id', description: 'ID do código a ser invalidado.', format: 'uuid' })
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
  @ApiParam({ name: 'id', description: 'ID do código a ser renovado.', format: 'uuid' })
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
  @ApiParam({ name: 'activityId', description: 'ID da atividade.', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Lista de códigos da atividade.' })
  @Get('activity/:activityId')
  async listByActivity(
    @Param('activityId') activityId: string,
    @User() user: UserPayload,
  ) {
    return this.codeService.listCodesByActivity(activityId, user);
  }
}
