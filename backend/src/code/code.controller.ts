import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Roles('teacher', 'admin')
  @Post()
  async create(@Body() dto: CreateCodeDto, @User() user: UserPayload) {
    return this.codeService.createCode(dto, user);
  }

  @Roles('teacher', 'admin')
  @Patch(':id/invalidate')
  async invalidate(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.invalidateCode(id, user);
  }

  @Roles('teacher', 'admin')
  @Patch(':id/renew')
  async renew(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.renewCode(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Get('activity/:activityId')
  async listByActivity(
    @Param('activityId') activityId: string,
    @User() user: UserPayload,
  ) {
    return this.codeService.listCodesByActivity(activityId, user);
  }
}
