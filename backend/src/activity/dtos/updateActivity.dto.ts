import { ActivityType } from 'src/Enums/activity.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiPropertyOptional({ example: 'Seminário atualizado', maxLength: 50 })
  name?: string;

  @ApiPropertyOptional({ example: '2026-10-12T23:59:59.000Z', format: 'date-time' })
  date?: string;

  @ApiPropertyOptional({ enum: ActivityType, enumName: 'ActivityType', example: ActivityType.ACTIVITY })
  type?: ActivityType;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', format: 'uuid' })
  classId?: string;

  @ApiPropertyOptional({ example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8', format: 'uuid', nullable: true })
  assessmentId?: string;
}
