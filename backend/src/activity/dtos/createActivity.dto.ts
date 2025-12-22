import { ActivityType } from 'src/Enums/activity.enum';

export class CreateActivityDto {
  name: string;
  date: Date;
  type: ActivityType;
  classId: string;
  assessmentId: string;
}
