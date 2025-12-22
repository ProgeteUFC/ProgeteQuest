import { Controller, Post, Body } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dtos/createCheckin.dto';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  async create(@Body() dto: CreateCheckinDto) {
    return this.checkinService.createCheckin(dto);
  }
}
