import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  async create(@Body() dto: CreateCodeDto, @User() user: any) {
    return this.codeService.createCode(dto, user);
  }

  @Roles('teacher')
  @Patch(':id/invalidate')
  async invalidate(@Param('id') id: string, @User() user: any) {
    return this.codeService.invalidateCode(id, user);
  }

  @Roles('teacher')
  @Patch(':id/renew')
  async renew(@Param('id') id: string, @User() user: any) {
    return this.codeService.renewCode(id, user);
  }

  @Get('activity/:activityId')
  async listByActivity(
    @Param('activityId') activityId: string,
    @User() user: any,
  ) {
    return this.codeService.listCodesByActivity(activityId, user);
  }
}