import { Controller, Post, Body } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dtos/createCheckin.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Roles('student', 'teacher', 'admin')
  @Post()
  async create(@Body() dto: CreateCheckinDto, @User() user: any) {
    return this.checkinService.createCheckin(dto, user);
  }
}