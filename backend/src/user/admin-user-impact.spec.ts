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
import { Forum } from '../forum/entities/forum.entity';
import { Code } from '../code/entities/code.entity';

describe('UserService.getDeletionImpact', () => {
  const counts = new Map<unknown, number>([
    [StudentClass, 2],
    [ClassEntity, 3],
    [Activity, 4],
    [Assessment, 5],
    [Checkin, 6],
    [Topic, 7],
    [Post, 8],
    [Forum, 9],
    [Code, 10],
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
    getRepository.mockImplementation((entity: unknown) => ({
      countBy: jest.fn(async () => counts.get(entity) ?? 0),
      count: jest.fn(async () => counts.get(entity) ?? 0),
    }));
    userRepository.findOne.mockResolvedValue({ userId: 'user-id' });
  });

  it('returns counts for persisted user relationships only', async () => {
    await expect(service.getDeletionImpact('user-id')).resolves.toEqual({
      userId: 'user-id',
      type: undefined,
      impact: {},
      classesAsStudent: 2,
      classesAsTeacher: 3,
      activities: 4,
      assessments: 5,
      checkins: 6,
      forumTopics: 7,
      forumPosts: 8,
      enrollments: 2,
      forums: 9,
      codes: 10,
      hasDependencies: true,
      canDelete: false,
      blockedReasons: [
        'Existem vínculos ou histórico acadêmico. A exclusão está bloqueada.',
      ],
    });
  });

  it('counts teacher check-ins, enrollments and forum content through class ownership', async () => {
    await service.getDeletionImpact('teacher-id');
    const calls = getRepository.mock.results;
    const checkins = calls.find(
      (_, index) => getRepository.mock.calls[index][0] === Checkin,
    )!.value;
    expect(checkins.count).toHaveBeenCalledWith({
      where: [
        { studentId: 'teacher-id' },
        { activity: { class: { teacherId: 'teacher-id' } } },
      ],
    });
    const posts = calls.find(
      (_, index) => getRepository.mock.calls[index][0] === Post,
    )!.value;
    expect(posts.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.arrayContaining([
          { topic: { forum: { turma: { teacherId: 'teacher-id' } } } },
        ]),
      }),
    );
  });

  it('reports an explicit empty state without deleting anything', async () => {
    getRepository.mockImplementation(() => ({
      countBy: jest.fn(async () => 0),
      count: jest.fn(async () => 0),
    }));
    const impact = await service.getDeletionImpact('user-id');
    expect(impact).toMatchObject({
      hasDependencies: false,
      canDelete: true,
      blockedReasons: [],
    });
  });

  it('rejects impact queries for an unknown user', async () => {
    userRepository.findOne.mockResolvedValue(null);
    await expect(service.getDeletionImpact('missing')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
