import { Class } from 'src/class/entities/class.entity';
import { Topic } from './topic.entity';
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
export class Forum {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'forum_id',
    length: 36,
  })
  forumId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'turma_id',
    length: 36,
  })
  turmaId: string;

  @CreateDateColumn({ name: 'created_at' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  atualizadoEm: Date;

  // Relação com Class (Turma) (1,1)
  @ManyToOne(() => Class)
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'classId' })
  turma: Class;

  // Relação com Topic (0,n)
  @OneToMany(() => Topic, (topic) => topic.forum)
  topics: Topic[];
}
