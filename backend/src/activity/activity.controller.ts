import { Controller, Delete } from '@nestjs/common';
import { Get, Post, Put, Param, Body } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dtos/createActivity.dto';
import { Activity } from './entities/activity.entity';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Roles('teacher', 'student') //?
  @Get()
  getAll(): Promise<Activity[]> {
    return this.activityService.getAllActivities();
  }

  @Roles('teacher')
  @Post()
  create(@Body() newActivity: CreateActivityDto): Promise<Activity> {
    return this.activityService.createActivity(newActivity);
  }

  @Roles('teacher')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedActivity: CreateActivityDto,
  ): Promise<Activity> {
    return this.activityService.updateActivity(id, updatedActivity);
  }

  @Roles('teacher')
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Activity[]> {
    return this.activityService.deleteActivity(id);
  }

  @Roles('teacher', 'student')
  @Post('search')
  async searchActivities(
    @Body() body: { name?: string; classId?: string; assessmentId?: string },
  ) {
    return this.activityService.searchActivities(body);
  }

  @Roles('teacher', 'student')
  @Get('class/:classId')
  async listByClass(
    @Param('classId') classId: string,
    @Body() body: { orderBy?: 'name' | 'date'; order?: 'ASC' | 'DESC' },
  ) {
    return this.activityService.listActivitiesByClass(
      classId,
      body.orderBy ?? 'date',
      body.order ?? 'ASC',
    );
  }
}
