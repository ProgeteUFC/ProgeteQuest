import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import {
  TopicListResponseDto,
  PostListResponseDto,
} from './dtos/responses/index';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('turmas/:id/forum')
  async createForum(@Param('id') turmaId: string) {
    return this.forumService.createForum(turmaId);
  }

  @Roles('teacher', 'student')
  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() user: UserPayload,
  ) {
    return this.forumService.createTopic(forumId, createTopicDto, user.userId);
  }

  @Roles('teacher', 'student')
  @Get('forum/:forumId/topics')
  async getTopics(
    @Param('forumId') forumId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<TopicListResponseDto> {
    return this.forumService.listTopicsByForum(forumId, page, limit);
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
    @User() user: UserPayload,
  ) {
    return this.forumService.createPost(topicId, createPostDto, user.userId);
  }
}
