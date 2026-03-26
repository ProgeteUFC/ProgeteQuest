import { User } from 'src/user/entities/user.entity';
import { Forum } from './forum.entity';
import { Post } from './post.entity';
import { TopicStatus } from 'src/Enums/topicStatus.enum';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Topic {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'topic_id',
    length: 36,
  })
  topicId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'forum_id',
    length: 36,
  })
  forumId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'autor_id',
    length: 36,
  })
  autorId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'titulo',
    length: 255,
  })
  titulo: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'descricao',
  })
  descricao: string | null;

  @Column({
    type: 'enum',
    enum: TopicStatus,
    nullable: false,
    name: 'status',
    default: TopicStatus.OPEN,
  })
  status: TopicStatus;

  @CreateDateColumn({ name: 'created_at' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  atualizadoEm: Date;

  // Relação com Forum (1,1)
  @ManyToOne(() => Forum, (forum) => forum.topics)
  @JoinColumn({ name: 'forum_id', referencedColumnName: 'forumId' })
  forum: Forum;

  // Relação com User (Autor - Aluno ou Professor) (1,1)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'autor_id', referencedColumnName: 'userId' })
  autor: User;

  // Relação com Post (0,n)
  @OneToMany(() => Post, (post) => post.topic)
  posts: Post[];
}
