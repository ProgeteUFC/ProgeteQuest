import { Controller, Delete } from '@nestjs/common';
import { Get, Post, Put, Param, Body } from '@nestjs/common';
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedActivity: CreateActivityDto,
  ): Promise<Activity> {
    return this.activityService.updateActivity(id, updatedActivity);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Activity[]> {
    return this.activityService.deleteActivity(id);
  }
}
