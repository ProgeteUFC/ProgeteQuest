// backend/src/forum/forum.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forum, Topic, Post } from './entities/index';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
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
    user: ForumContextUser,
  ): Promise<Topic> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });
    if (!forum) {
      throw new NotFoundException(`Fórum com ID ${forumId} não encontrado`);
    }

    const isStudentInClass = await this.classRepository.exists({
      where: {
        classId: forum.turmaId,
        studentClasses: {
          studentId: user.id,
        },
      },
    });

    if (!canCreateTopic(user, isStudentInClass)) {
      throw new ForbiddenException(
        `Você não tem permissão para criar tópicos nesse fórum`,
      );
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      topicId: generateUuid(),
      forumId: forumId,
      status: TopicStatus.OPEN,
    });

    return this.topicRepository.save(topic);
  }

  async listTopicsByForum(
    forumId: string,
    status?: TopicStatus,
  ): Promise<Topic[]> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });
    if (!forum) {
      throw new NotFoundException(`Fórum não encontrado`);
    }

    const whereCondition: any = { forumId };

    if (status) {
      whereCondition.status = status;
    }

    return this.topicRepository.find({
      where: whereCondition,
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  async listPostsByTopic(topicId: string): Promise<Post[]> {
    const topic = await this.topicRepository.findOne({ where: { topicId } });
    if (!topic) {
      throw new NotFoundException(`Tópico com ID ${topicId} não encontrado`);
    }

    return this.postRepository.find({
      where: { topicId },
      relations: ['autor'],
      order: { criadoEm: 'ASC' },
    });
  }

  async createPost(
    topicId: string,
    createPostDto: CreatePostDto,
    user: ForumContextUser,
  ): Promise<Post> {
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

    const isUserInClass = await this.classRepository.exists({
      where: {
        classId: topic.forum.turmaId,
        studentClasses: {
          studentId: user.id,
        },
      },
    });

    if (!canAnswer(user, topicContext, isUserInClass)) {
      throw new ForbiddenException(
        'Você não pode responder a este tópico. Ele pode estar fechado ou você não pertence a essa turma.',
      );
    }

    const post = this.postRepository.create({
      ...createPostDto,
      postId: generateUuid(),
      topicId: topicId,
    });

    return this.postRepository.save(post);
  }

  async closeTopic(topicId: string, user: ForumContextUser): Promise<Topic> {
    const topic = await this.topicRepository.findOne({
      where: { topicId },
      relations: ['autor'],
    });

    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    const topicContext: TopicContext = {
      authorId: topic.autorId,
      status: topic.status,
    };

    const isAllowed = canClose(user, topicContext);

    if (!isAllowed) {
      throw new ForbiddenException(
        `Você não tem permissão para fechar esse tópico.`,
      );
    }

    topic.status = TopicStatus.CLOSED;

    return this.topicRepository.save(topic);
  }
}
