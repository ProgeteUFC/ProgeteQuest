import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dtos/createActivity.dto';
import { Activity } from './entities/activity.entity';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getAll(): Promise<Activity[]> {
    return this.activityService.getAllActivities();
  }

  @Post()
  create(@Body() newActivity: CreateActivityDto): Promise<Activity> {
    return this.activityService.createActivity(newActivity);
  }
}
