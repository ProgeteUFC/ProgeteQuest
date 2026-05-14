import { Controller, Delete } from '@nestjs/common';
import { Get, Post, Put, Param, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dtos/createActivity.dto';
import { Activity } from './entities/activity.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchActivityDto } from './dtos/searchActivity.dto';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Roles('teacher', 'admin', 'student')
  @Get()
  getAll(@User() user: any): Promise<Activity[]> {
    return this.activityService.getAllActivities(user);
  }

  @Roles('teacher', 'admin')
  @Post()
  create(
    @Body() newActivity: CreateActivityDto,
    @User() user: any,
  ): Promise<Activity> {
    return this.activityService.createActivity(newActivity, user);
  }

  @Roles('teacher', 'admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedActivity: CreateActivityDto,
    @User() user: any,
  ): Promise<Activity> {
    return this.activityService.updateActivity(id, updatedActivity, user);
  }

  @Roles('teacher', 'admin')
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @User() user: any,
  ): Promise<Activity[]> {
    return this.activityService.deleteActivity(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Post('search')
  async searchActivities(
    @Body() searchDto: SearchActivityDto,
    @User() user: any,
  ) {
    return this.activityService.searchActivities(searchDto, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Get('class/:classId')
  async listByClass(
    @Param('classId') classId: string,
    @User() user: any,
  ): Promise<Activity[]> {
    return this.activityService.listActivitiesByClass(
      classId,
      'date',
      'ASC',
      user.userId,
      user,
    );
  }
}