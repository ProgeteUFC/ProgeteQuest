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
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Roles('teacher', 'admin')
  @Post('turmas/:id/forum')
  async createForum(@Param('id') turmaId: string) {
    return this.forumService.createForum(turmaId);
  }

  @Roles('teacher', 'admin', 'student')
  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() user: any,
  ) {
    return this.forumService.createTopic(forumId, createTopicDto, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Get('forum/:forumId/topics')
  async getTopics(
    @Param('forumId') forumId: string,
    @Query('status') status?: TopicStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<TopicListResponseDto> {
    return this.forumService.listTopicsByForum(forumId, status, page, limit);
  }

  @Roles('teacher', 'admin', 'student')
  @Get('topic/:topicId/posts')
  async getPosts(
    @Param('topicId') topicId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ): Promise<PostListResponseDto> {
    return this.forumService.listPostsByTopic(topicId, page, limit);
  }

  @Roles('teacher', 'admin', 'student')
  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
    @User() user: any,
  ) {
    return this.forumService.createPost(topicId, createPostDto, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Patch('topic/:topicId/close')
  async closeTopic(@Param('topicId') topicId: string, @User() user: any) {
    return this.forumService.closeTopic(topicId, user);
  }
}
