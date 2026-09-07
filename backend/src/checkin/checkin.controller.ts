import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dtos/createCheckin.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Check-in')
@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Roles('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Realizar check-in',
    description:
      'Realiza o check-in de um estudante em uma atividade usando um código.',
  })
  @ApiBody({
    type: CreateCheckinDto,
    description: 'Dados para check-in',
    examples: {
      exemplo: {
        value: {
          activityId: 'uuid-da-atividade',
          studentId: 'uuid-do-estudante',
          codeId: 'uuid-do-codigo',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Check-in realizado com sucesso.',
  })
  @Post()
  async create(@Body() dto: CreateCheckinDto, @User() user: UserPayload) {
    return this.checkinService.createCheckin(dto, user);
  }

  @Roles('teacher', 'admin')
  @Get('activity/:activityId')
  async listByActivity(
    @Param('activityId') activityId: string,
    @User() user: UserPayload,
  ) {
    return this.checkinService.listByActivity(activityId, user);
  }
}
