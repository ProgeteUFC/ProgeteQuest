// backend/src/forum/forum.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forum, Topic, Post } from './entities/index';
import { CreateTopicDto, CreatePostDto } from './dtos/index';
import { Class } from 'src/class/entities/class.entity';
import { generateUuid } from 'src/utils/generateUuid';

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
  ): Promise<Topic> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });
    if (!forum) {
      throw new NotFoundException(`Fórum com ID ${forumId} não encontrado`);
    }

    const topic = this.topicRepository.create({
      ...createTopicDto,
      topicId: generateUuid(),
      forumId: forumId,
    });

    return this.topicRepository.save(topic);
  }

  async listTopicsByForum(forumId: string): Promise<Topic[]> {
    const forum = await this.forumRepository.findOne({ where: { forumId } });
    if (!forum) {
      throw new NotFoundException(`Fórum não encontrado`);
    }

    return this.topicRepository.find({
      where: { forumId },
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
  ): Promise<Post> {
    const topic = await this.topicRepository.findOne({ where: { topicId } });
    if (!topic) {
      throw new NotFoundException(`Tópico não encontrado`);
    }

    const post = this.postRepository.create({
      ...createPostDto,
      postId: generateUuid(),
      topicId: topicId,
    });

    return this.postRepository.save(post);
  }
}
