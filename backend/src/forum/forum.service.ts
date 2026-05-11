import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createForum(turmaId: string): Promise<Forum> {
    const turma = await this.classRepository.findOne({
      where: { classId: turmaId },
    });
    if (!turma) {
      throw new NotFoundException(`Turma com ID ${turmaId} não encontrada`);
    }

    const existingForum = await this.forumRepository.findOne({
      where: { turmaId },
    });
    if (existingForum) {
      return existingForum;
    }

    const forum = this.forumRepository.create({
      forumId: generateUuid(),
      turmaId: turmaId,
    });

    return this.forumRepository.save(forum);
  }

  async createTopic(
    forumId: string,
    createTopicDto: CreateTopicDto,
    user: any,
  ): Promise<TopicResponseDto> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });
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
          `Você não tem permissão para criar tópicos nesse fórum`,
        );
      }
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      topicId: generateUuid(),
      forumId: forumId,
      autorId: user.userId,
      status: TopicStatus.OPEN,
    });

    const savedTopic = await this.topicRepository.save(topic);

    // Recarregar com relações e transformar em DTO
    return this.transformTopicToResponse(savedTopic.topicId);
  }

  async listTopicsByForum(
    forumId: string,
    status?: TopicStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<TopicListResponseDto> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });

    if (!forum) {
      throw new NotFoundException(`Fórum não encontrado`);
    }

    const whereCondition: any = { forumId };
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
    user: any,
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
          'Você não pode responder a este tópico. Ele pode estar fechado ou você não pertence a essa turma.',
        );
      }
    }

    const post = this.postRepository.create({
      ...createPostDto,
      postId: generateUuid(),
      topicId: topicId,
      autorId: user.userId,
    });

    const savedPost = await this.postRepository.save(post);

    return this.transformPostToResponse(savedPost.postId);
  }

  async listPostsByTopic(
    topicId: string,
    page: number = 1,
    limit: number = 15,
  ): Promise<PostListResponseDto> {
    const topic = await this.topicRepository.findOne({ where: { topicId } });

    if (!topic) {
      throw new NotFoundException(`Tópico com ID ${topicId} não encontrado`);
    }

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

  // ========== Métodos auxiliares de transformação ==========

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

  async closeTopic(topicId: string, user: any): Promise<Topic> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['autor'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    if (!user.isAdmin) {
      const topicContext: TopicContext = {
        authorId: topic.autorId,
        status: topic.status,
      };

      const forumUser: ForumContextUser = {
        id: user.userId,
        isTeacher: user.type === 'Teacher' || user.type === 'teacher',
        isStudent: user.type === 'Student' || user.type === 'student',
      };

      const isAllowed = canClose(forumUser, topicContext);

      if (!isAllowed) {
        throw new ForbiddenException(
          `Você não tem permissão para fechar esse tópico.`,
        );
      }
    }

    topic.status = TopicStatus.CLOSED;

    return this.topicRepository.save(topic);
  }
}