import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Forum, Topic, Post } from './entities/index';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import {
  TopicResponseDto,
  PostResponseDto,
  TopicListResponseDto,
  PostListResponseDto,
} from './dtos/responses/index';
import { Class } from 'src/class/entities/class.entity';
import { generateUuid } from 'src/utils/generateUuid';
import {
  canClose,
  ForumContextUser,
  TopicContext,
  canCreateTopic,
  canAnswer,
} from 'src/utils/forumPermissions';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import { UserPayload } from 'src/decorators/user.decorator';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,

    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  private async validateUserInClass(
    turmaId: string,
    user: ForumContextUser,
  ): Promise<boolean> {
    if (user.isTeacher) {
      return true;
    }

    const isStudentInClass = await this.classRepository.exists({
      where: {
        classId: turmaId,
        studentClasses: {
          studentId: user.id,
        },
      },
    });

    if (!isStudentInClass) {
      throw new ForbiddenException(
        'Acesso negado: Você não pertence a esta turma e não pode visualizar ou interagir com este conteúdo.',
      );
    }

    return true;
  }

  async createForum(turmaId: string, user: ForumContextUser): Promise<Forum> {
    const turma = await this.classRepository.findOne({
      where: { classId: turmaId },
    });

    if (!turma) {
      throw new NotFoundException(`Turma com ID ${turmaId} não encontrada`);
    }

    if (!user.isTeacher) {
      throw new ForbiddenException(
        'Acesso negado: Apenas professores podem habilitar o fórum de uma turma.',
      );
    }

    const existingForum = await this.forumRepository.findOne({
      where: { turmaId },
    });

    if (existingForum) {
      return existingForum;
    }

    const forum = this.forumRepository.create({
      forumId: generateUuid(),
      turmaId,
    });

    return this.forumRepository.save(forum);
  }

  async createTopic(
    forumId: string,
    createTopicDto: CreateTopicDto,
    user: UserPayload,
  ): Promise<TopicResponseDto> {
    const forum = await this.forumRepository.findOne({
      where: { forumId },
    });

    if (!forum) {
      throw new NotFoundException(`Fórum com ID ${forumId} não encontrado`);
    }

    if (!user.isAdmin) {
      const isStudentInClass = await this.classRepository.exists({
        where: {
          classId: forum.turmaId,
          studentClasses: {
            studentId: user.userId,
          },
        },
      });

      const forumUser: ForumContextUser = {
        id: user.userId,
        isTeacher: user.type === 'Teacher' || user.type === 'teacher',
        isStudent: user.type === 'Student' || user.type === 'student',
      };

      if (!canCreateTopic(forumUser, isStudentInClass)) {
        throw new ForbiddenException(
          'Você não tem permissão para criar tópicos nesse fórum. Certifique-se de que você é um aluno matriculado nesta turma.',
        );
      }
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      topicId: generateUuid(),
      forumId,
      autorId: user.userId,
      status: TopicStatus.OPEN,
    });

    const savedTopic = await this.topicRepository.save(topic);

    return this.transformTopicToResponse(savedTopic.topicId);
  }

  async listTopicsByForum(
    forumId: string,
    user: ForumContextUser,
    status?: TopicStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<TopicListResponseDto> {
    const forum = await this.forumRepository.findOne({
      where: { forumId },
    });

    if (!forum) {
      throw new NotFoundException(`Fórum não encontrado`);
    }

    await this.validateUserInClass(forum.turmaId, user);

    const whereCondition: FindOptionsWhere<Topic> = { forumId };

    if (status) {
      whereCondition.status = status;
    }

    const [topics, total] = await this.topicRepository.findAndCount({
      where: whereCondition,
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = await Promise.all(
      topics.map((topic) => this.transformTopicToResponse(topic.topicId)),
    );

    return {
      data,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createPost(
    topicId: string,
    createPostDto: CreatePostDto,
    user: UserPayload,
  ): Promise<PostResponseDto> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['forum'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    const topicContext: TopicContext = {
      authorId: topic.autorId,
      status: topic.status,
    };

    if (!user.isAdmin) {
      const isUserInClass = await this.classRepository.exists({
        where: {
          classId: topic.forum.turmaId,
          studentClasses: {
            studentId: user.userId,
          },
        },
      });

      const forumUser: ForumContextUser = {
        id: user.userId,
        isTeacher: user.type === 'Teacher' || user.type === 'teacher',
        isStudent: user.type === 'Student' || user.type === 'student',
      };

      if (!canAnswer(forumUser, topicContext, isUserInClass)) {
        throw new ForbiddenException(
          'Você não pode responder a este tópico. O tópico pode estar fechado ou você não pertence a essa turma.',
        );
      }
    }

    const post = this.postRepository.create({
      ...createPostDto,
      postId: generateUuid(),
      topicId,
      autorId: user.userId,
    });

    const savedPost = await this.postRepository.save(post);

    return this.transformPostToResponse(savedPost.postId);
  }

  async listPostsByTopic(
    topicId: string,
    user: ForumContextUser,
    page: number = 1,
    limit: number = 15,
  ): Promise<PostListResponseDto> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['forum'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico com ID ${topicId} não encontrado`);
    }

    await this.validateUserInClass(topic.forum.turmaId, user);

    const [posts, total] = await this.postRepository.findAndCount({
      where: { topicId },
      relations: ['autor'],
      order: { criadoEm: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = posts.map((post) => {
      const dto = new PostResponseDto();

      dto.postId = post.postId;
      dto.mensagem = post.mensagem;
      dto.topicId = post.topicId;
      dto.criadoEm = post.criadoEm;
      dto.atualizadoEm = post.atualizadoEm;
      dto.autor = {
        userId: post.autor.userId,
        name: post.autor.name,
        email: post.autor.email,
      };

      return dto;
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async transformTopicToResponse(
    topicId: string,
  ): Promise<TopicResponseDto> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['autor'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    const postsCount = await this.postRepository.count({
      where: { topicId },
    });

    const ultimoPost = await this.postRepository.findOne({
      where: { topicId },
      order: { criadoEm: 'DESC' },
    });

    const dto = new TopicResponseDto();

    dto.topicId = topic.topicId;
    dto.forumId = topic.forumId;
    dto.titulo = topic.titulo;
    dto.descricao = topic.descricao ?? undefined;
    dto.status = topic.status;
    dto.criadoEm = topic.criadoEm;
    dto.atualizadoEm = topic.atualizadoEm;
    dto.postsCount = postsCount;
    dto.ultimoPostEm = ultimoPost?.criadoEm;
    dto.autor = {
      userId: topic.autor.userId,
      name: topic.autor.name,
      email: topic.autor.email,
    };

    return dto;
  }

  private async transformPostToResponse(
    postId: string,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { postId },
      relations: ['autor'],
    });

    if (!post) {
      throw new NotFoundException(`Post não encontrado`);
    }

    const dto = new PostResponseDto();

    dto.postId = post.postId;
    dto.mensagem = post.mensagem;
    dto.topicId = post.topicId;
    dto.criadoEm = post.criadoEm;
    dto.atualizadoEm = post.atualizadoEm;
    dto.autor = {
      userId: post.autor.userId,
      name: post.autor.name,
      email: post.autor.email,
    };

    return dto;
  }

  async closeTopic(
    topicId: string,
    user: UserPayload,
  ): Promise<TopicResponseDto> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['autor', 'forum'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    if (!user.isAdmin) {
      const forumUser: ForumContextUser = {
        id: user.userId,
        isTeacher: user.type === 'Teacher' || user.type === 'teacher',
        isStudent: user.type === 'Student' || user.type === 'student',
      };

      await this.validateUserInClass(topic.forum.turmaId, forumUser);

      const topicContext: TopicContext = {
        authorId: topic.autorId,
        status: topic.status,
      };

      const isAllowed = canClose(forumUser, topicContext);

      if (!isAllowed) {
        throw new ForbiddenException(
          'Acesso negado: Você não tem permissão para fechar esse tópico. Apenas o criador do tópico ou o professor da turma podem realizar esta ação.',
        );
      }
    }

    topic.status = TopicStatus.CLOSED;

    const savedTopic = await this.topicRepository.save(topic);

    return this.transformTopicToResponse(savedTopic.topicId);
  }
}
