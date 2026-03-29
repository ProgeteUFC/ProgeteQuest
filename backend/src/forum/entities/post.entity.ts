import { User } from 'src/user/entities/user.entity';
import { Topic } from './topic.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'post_id',
    length: 36,
  })
  postId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'topic_id',
    length: 36,
  })
  topicId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'autor_id',
    length: 36,
  })
  autorId: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'mensagem',
  })
  mensagem: string;

  @CreateDateColumn({ name: 'created_at' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  atualizadoEm: Date;

  // Relação com Topic (1,1)
  @ManyToOne(() => Topic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'topicId' })
  topic: Topic;

  // Relação com User (Autor - Aluno ou Professor) (1,1)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'autor_id', referencedColumnName: 'userId' })
  autor: User;
}
