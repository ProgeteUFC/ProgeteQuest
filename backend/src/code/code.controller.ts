import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dtos/createCode.dto';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  async create(@Body() dto: CreateCodeDto) {
    return this.codeService.createCode(dto);
  }

  @Patch(':id/invalidate')
  async invalidate(@Param('id') id: string) {
    return this.codeService.invalidateCode(id);
  }

  @Patch(':id/renew')
  async renew(@Param('id') id: string) {
    return this.codeService.renewCode(id);
  }

  @Get('activity/:activityId')
  async listByActivity(@Param('activityId') activityId: string) {
    return this.codeService.listCodesByActivity(activityId);
  }
  F;
}
