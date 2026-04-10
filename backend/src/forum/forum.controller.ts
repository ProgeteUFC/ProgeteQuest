import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
  Patch,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { ForumContextUser } from 'src/utils/forumPermissions';
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

  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createTopic(forumId, createTopicDto, forumUser);
  }

  @Get('forum/:forumId/topics')
  async getTopics(
    @Param('forumId') forumId: string,
    @Query('status') status?: TopicStatus,
  ) {
    return this.forumService.listTopicsByForum(forumId, status);
  }

  @Get('topic/:topicId/posts')
  async getPosts(@Param('topicId') topicId: string) {
    return this.forumService.listPostsByTopic(topicId);
  }

  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createPost(topicId, createPostDto, forumUser);
  }

  @Patch('topic/:topicId/close')
  async closeTopic(
    @Param('topicId') topicId: string,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.closeTopic(topicId, forumUser);
  }
}
