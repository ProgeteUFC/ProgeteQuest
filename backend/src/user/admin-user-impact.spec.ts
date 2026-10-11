import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { StudentClass } from '../student_class/entities/studentClass.entity';
import { Class as ClassEntity } from '../class/entities/class.entity';
import { Activity } from '../activity/entities/activity.entity';
import { Assessment } from '../assessment/entities/assessment.entity';
import { Checkin } from '../checkin/entities/checkin.entity';
import { Topic } from '../forum/entities/topic.entity';
import { Post } from '../forum/entities/post.entity';

describe('UserService.getDeletionImpact', () => {
  const counts = new Map<unknown, number>([
    [StudentClass, 2],
    [ClassEntity, 3],
    [Activity, 4],
    [Assessment, 5],
    [Checkin, 6],
    [Topic, 7],
    [Post, 8],
  ]);
  const getRepository = jest.fn((entity: unknown) => ({
    countBy: jest.fn(async () => counts.get(entity) ?? 0),
    count: jest.fn(async () => counts.get(entity) ?? 0),
  }));
  const userRepository = { findOne: jest.fn() };
  const service = new UserService(
    userRepository as never,
    {} as never,
    {} as never,
    {} as never,
    { getRepository } as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findOne.mockResolvedValue({ userId: 'user-id' });
  });

  it('returns counts for persisted user relationships only', async () => {
    await expect(service.getDeletionImpact('user-id')).resolves.toEqual({
      userId: 'user-id',
      classesAsStudent: 2,
      classesAsTeacher: 3,
      activities: 4,
      assessments: 5,
      checkins: 6,
      forumTopics: 7,
      forumPosts: 8,
    });
  });

  it('rejects impact queries for an unknown user', async () => {
    userRepository.findOne.mockResolvedValue(null);
    await expect(service.getDeletionImpact('missing')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});