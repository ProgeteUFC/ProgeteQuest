import { ActivityType } from 'src/Enums/activity.enum';

export class UpdateActivityDto {
  name?: string;
  date?: string;
  type?: ActivityType;
  classId?: string;
  assessmentId?: string;
}
