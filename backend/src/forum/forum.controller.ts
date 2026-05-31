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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import {
  TopicListResponseDto,
  PostListResponseDto,
  TopicResponseDto,
  PostResponseDto,
} from './dtos/responses/index';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { ForumContextUser } from 'src/utils/forumPermissions';

@ApiTags('Fórum')
@ApiBearerAuth()
@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  private mapToForumUser(payload: UserPayload): ForumContextUser {
    const type = String(payload.type).toLowerCase();

    return {
      id: String(payload.userId),
      isTeacher: type === 'teacher' || payload.isAdmin === true,
      isStudent: type === 'student',
    };
  }

  @ApiOperation({ summary: 'Criar um fórum para uma turma' })
  @ApiParam({ name: 'id', description: 'ID da turma', type: String })
  @ApiResponse({ status: 201, description: 'Fórum criado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @Roles('teacher', 'admin')
  @Post('turmas/:id/forum')
  async createForum(
    @Param('id') turmaId: string,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createForum(turmaId, forumUser);
  }

  @ApiOperation({ summary: 'Criar um novo tópico no fórum' })
  @ApiParam({ name: 'forumId', description: 'ID do fórum', type: String })
  @ApiBody({ type: CreateTopicDto })
  @ApiResponse({
    status: 201,
    description: 'Tópico criado com sucesso.',
    type: TopicResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fórum não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: Usuário não pertence à turma.',
  })
  @Roles('teacher', 'admin', 'student')
  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() user: UserPayload,
  ) {
    return this.forumService.createTopic(forumId, createTopicDto, user);
  }

  @ApiOperation({ summary: 'Listar tópicos de um fórum' })
  @ApiParam({ name: 'forumId', description: 'ID do fórum', type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TopicStatus,
    description: 'Filtrar por status (OPEN/CLOSED)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de tópicos retornada com sucesso.',
    type: TopicListResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fórum não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: Usuário não pertence à turma.',
  })
  @Roles('teacher', 'admin', 'student')
  @Get('forum/:forumId/topics')
  async getTopics(
    @Param('forumId') forumId: string,
    @User() userPayload: UserPayload,
    @Query('status') status?: TopicStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<TopicListResponseDto> {
    const forumUser = this.mapToForumUser(userPayload);

    return this.forumService.listTopicsByForum(
      forumId,
      forumUser,
      status,
      page,
      limit,
    );
  }

  @ApiOperation({ summary: 'Listar postagens de um tópico' })
  @ApiParam({ name: 'topicId', description: 'ID do tópico', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 15 })
  @ApiResponse({
    status: 200,
    description: 'Lista de postagens retornada com sucesso.',
    type: PostListResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: Usuário não pertence à turma.',
  })
  @Roles('teacher', 'admin', 'student')
  @Get('topic/:topicId/posts')
  async getPosts(
    @Param('topicId') topicId: string,
    @User() userPayload: UserPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ): Promise<PostListResponseDto> {
    const forumUser = this.mapToForumUser(userPayload);

    return this.forumService.listPostsByTopic(
      topicId,
      forumUser,
      page,
      limit,
    );
  }

  @ApiOperation({ summary: 'Responder a um tópico (criar postagem)' })
  @ApiParam({ name: 'topicId', description: 'ID do tópico', type: String })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Postagem criada com sucesso.',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado: Tópico fechado ou usuário não pertence à turma.',
  })
  @Roles('teacher', 'admin', 'student')
  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
    @User() user: UserPayload,
  ) {
    return this.forumService.createPost(topicId, createPostDto, user);
  }

  @ApiOperation({ summary: 'Fechar um tópico' })
  @ApiParam({ name: 'topicId', description: 'ID do tópico', type: String })
  @ApiResponse({ status: 200, description: 'Tópico fechado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: Apenas o autor ou um professor podem fechar.',
  })
  @Roles('teacher', 'admin', 'student')
  @Patch('topic/:topicId/close')
  async closeTopic(
    @Param('topicId') topicId: string,
    @User() user: UserPayload,
  ) {
    return this.forumService.closeTopic(topicId, user);
  }
}