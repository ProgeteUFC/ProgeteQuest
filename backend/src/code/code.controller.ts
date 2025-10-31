import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  async create(@Body() dto: CreateCodeDto) {
    return this.codeService.createCode(dto);
  }

  @Roles('teacher')
  @Patch(':id/invalidate')
  async invalidate(@Param('id') id: string) {
    return this.codeService.invalidateCode(id);
  }

  @Roles('teacher')
  @Patch(':id/renew')
  async renew(@Param('id') id: string, @User() user: UserPayload) {
    return this.codeService.renewCode(id, user.userId);
  }

  @Get('activity/:activityId')
  async listByActivity(@Param('activityId') activityId: string) {
    return this.codeService.listCodesByActivity(activityId);
  }
}
