import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserPayload } from 'src/decorators/user.decorator';
import { ForumContextUser } from 'src/utils/forumPermissions';
import { CreatePostDto, CreateTopicDto } from './dtos/index';
import {
  ForumResponseDto,
  PostListResponseDto,
  PostResponseDto,
  TopicListResponseDto,
  TopicResponseDto,
} from './dtos/responses/index';
import { ForumService } from './forum.service';

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

  @ApiOperation({
    summary: 'Criar ou habilitar fórum da turma',
    description:
      'Cria o fórum de uma turma. Se a turma já tiver fórum, retorna o fórum existente. Disponível para professor e administrador.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da turma que receberá o fórum.',
    type: String,
    example: '9a8b7c6d-5e4f-3210-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 201,
    description: 'Fórum criado ou encontrado com sucesso.',
    type: ForumResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Turma não encontrada.' })
  @Roles('teacher', 'admin')
  @Post('turmas/:id/forum')
  async createForum(
    @Param('id') turmaId: string,
    @User() userPayload: UserPayload,
  ) {
    const forumUser = this.mapToForumUser(userPayload);
    return this.forumService.createForum(turmaId, forumUser);
  }

  @Roles('teacher', 'admin', 'student')
  @Get('turmas/:id/forum')
  async getForum(
    @Param('id') turmaId: string,
    @User() userPayload: UserPayload,
  ) {
    return this.forumService.getForumByClass(
      turmaId,
      this.mapToForumUser(userPayload),
    );
  }

  @ApiOperation({
    summary: 'Criar tópico no fórum',
    description:
      'Cria um tópico em um fórum. Alunos precisam estar matriculados na turma. Professores e administradores também podem criar tópicos.',
  })
  @ApiParam({
    name: 'forumId',
    description: 'ID do fórum onde o tópico será criado.',
    type: String,
    example: 'f1e2d3c4-b5a6-7890-cdef-ab1234567890',
  })
  @ApiBody({
    type: CreateTopicDto,
    description: 'Dados do tópico. O autor vem do usuário autenticado.',
    examples: {
      duvidaAtividade: {
        summary: 'Dúvida sobre atividade',
        value: {
          titulo: 'Dúvida sobre a atividade de programação',
          descricao:
            'Não entendi como entregar a atividade da aula 3. Alguém pode explicar?',
        },
      },
      avisoProfessor: {
        summary: 'Aviso do professor',
        value: {
          titulo: 'Material complementar da aula',
          descricao:
            'Disponibilizei um material extra para ajudar na atividade desta semana.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tópico criado com sucesso.',
    type: TopicResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: usuário não pertence à turma.',
  })
  @ApiResponse({ status: 404, description: 'Fórum não encontrado.' })
  @Roles('teacher', 'admin', 'student')
  @Post('forum/:forumId/topic')
  async createTopic(
    @Param('forumId') forumId: string,
    @Body() createTopicDto: CreateTopicDto,
    @User() user: UserPayload,
  ) {
    return this.forumService.createTopic(forumId, createTopicDto, user);
  }

  @ApiOperation({
    summary: 'Listar tópicos do fórum',
    description:
      'Retorna os tópicos de um fórum com paginação. Use o filtro status para ver apenas tópicos abertos ou fechados.',
  })
  @ApiParam({
    name: 'forumId',
    description: 'ID do fórum.',
    type: String,
    example: 'f1e2d3c4-b5a6-7890-cdef-ab1234567890',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TopicStatus,
    enumName: 'TopicStatus',
    description: 'Filtra por status do tópico.',
    example: TopicStatus.OPEN,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Página desejada.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de tópicos por página.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tópicos retornada com sucesso.',
    type: TopicListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: usuário não pertence à turma.',
  })
  @ApiResponse({ status: 404, description: 'Fórum não encontrado.' })
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

  @ApiOperation({
    summary: 'Listar postagens do tópico',
    description:
      'Retorna as postagens de um tópico em ordem de criação, com paginação.',
  })
  @ApiParam({
    name: 'topicId',
    description: 'ID do tópico.',
    type: String,
    example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Página desejada.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 15,
    description: 'Quantidade de postagens por página.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de postagens retornada com sucesso.',
    type: PostListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: usuário não pertence à turma.',
  })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @Roles('teacher', 'admin', 'student')
  @Get('topic/:topicId/posts')
  async getPosts(
    @Param('topicId') topicId: string,
    @User() userPayload: UserPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15,
  ): Promise<PostListResponseDto> {
    const forumUser = this.mapToForumUser(userPayload);

    return this.forumService.listPostsByTopic(topicId, forumUser, page, limit);
  }

  @ApiOperation({
    summary: 'Responder tópico',
    description:
      'Cria uma postagem dentro de um tópico. O tópico precisa estar aberto.',
  })
  @ApiParam({
    name: 'topicId',
    description: 'ID do tópico que receberá a resposta.',
    type: String,
    example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Mensagem da resposta. O autor vem do usuário autenticado.',
    examples: {
      respostaAluno: {
        summary: 'Resposta de aluno',
        value: {
          mensagem:
            'Também tive essa dúvida. A entrega é pelo menu de atividades.',
        },
      },
      respostaProfessor: {
        summary: 'Resposta de professor',
        value: {
          mensagem:
            'A entrega deve ser feita até sexta-feira, diretamente na atividade.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Postagem criada com sucesso.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 403,
    description:
      'Acesso negado: tópico fechado ou usuário não pertence à turma.',
  })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @Roles('teacher', 'admin', 'student')
  @Post('topic/:topicId/post')
  async createPost(
    @Param('topicId') topicId: string,
    @Body() createPostDto: CreatePostDto,
    @User() user: UserPayload,
  ) {
    return this.forumService.createPost(topicId, createPostDto, user);
  }

  @ApiOperation({
    summary: 'Fechar tópico',
    description:
      'Fecha um tópico aberto. O autor, professores e administradores podem fechar tópicos.',
  })
  @ApiParam({
    name: 'topicId',
    description: 'ID do tópico que será fechado.',
    type: String,
    example: 'b1c2d3e4-f5a6-7890-bcde-fa1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tópico fechado com sucesso.',
    type: TopicResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas o autor ou um professor podem fechar.',
  })
  @ApiResponse({ status: 404, description: 'Tópico não encontrado.' })
  @Roles('teacher', 'admin', 'student')
  @Patch('topic/:topicId/close')
  async closeTopic(
    @Param('topicId') topicId: string,
    @User() user: UserPayload,
  ) {
    return this.forumService.closeTopic(topicId, user);
  }
}
