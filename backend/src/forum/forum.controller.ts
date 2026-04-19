import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import {
  TopicListResponseDto,
  PostListResponseDto,
} from './dtos/responses/index';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { ForumContextUser } from 'src/utils/forumPermissions';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  private mapToForumUser(payload: UserPayload): ForumContextUser {
    return {
      id: payload.userId,
      isTeacher: payload.type === 'Teacher',
      isStudent: payload.type === 'Student',
    };
  }

  @Post('turmas/:id/forum')
  async createForum(@Param('id') turmaId: string) {
    return this.forumService.createForum(turmaId);
  }

  @Roles('teacher', 'student')
  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createTopic(forumId, createTopicDto, forumUser);
  }

  @Roles('teacher', 'student')
  @Get('forum/:forumId/topics')
  async getTopics(
    @Param('forumId') forumId: string,
    @Query('status') status?: TopicStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<TopicListResponseDto> {
    return this.forumService.listTopicsByForum(forumId, status, page, limit);
  }

  @Roles('teacher', 'student')
  @Get('topic/:topicId/posts')
  async getPosts(
    @Param('topicId') topicId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ): Promise<PostListResponseDto> {
    return this.forumService.listPostsByTopic(topicId, page, limit);
  }

  @Roles('teacher', 'student')
  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createPost(topicId, createPostDto, forumUser);
  }

  @Roles('teacher', 'student')
  @Patch('topic/:topicId/close')
  async closeTopic(
    @Param('topicId') topicId: string,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.closeTopic(topicId, forumUser);
  }
}