import { Controller, Post, Body } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dtos/createCheckin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Check-in')
@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar check-in', description: 'Realiza o check-in de um estudante em uma atividade usando um código.' })
  @ApiBody({ type: CreateCheckinDto, description: 'Dados para check-in', examples: { exemplo: { value: { activityId: 'uuid-da-atividade', studentId: 'uuid-do-estudante', codeId: 'uuid-do-codigo' } } } })
  @ApiResponse({ status: 201, description: 'Check-in realizado com sucesso.' })
  async create(@Body() dto: CreateCheckinDto) {
    return this.checkinService.createCheckin(dto);
  }
}
