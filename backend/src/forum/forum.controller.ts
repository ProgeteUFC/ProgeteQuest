import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreatePostDto } from './dtos/index';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('turmas/:id/forum')
  async createForum(@Param('id') turmaId: string) {
    return this.forumService.createForum(turmaId);
  }

  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.forumService.createTopic(forumId, createTopicDto);
  }

  @Get('forum/:forumId/topics')
  async getTopics(@Param('forumId') forumId: string) {
    return this.forumService.listTopicsByForum(forumId);
  }

  @Get('topic/:topicId/posts')
  async getPosts(@Param('topicId') topicId: string) {
    return this.forumService.listPostsByTopic(topicId);
  }

  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.forumService.createPost(topicId, createPostDto);
  }
}
