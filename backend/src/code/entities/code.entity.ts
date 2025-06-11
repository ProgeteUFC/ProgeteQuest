import { Activity } from 'src/activity/entities/activity.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity';
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
export class Code {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'code_id',
    length: 36,
  })
  codeId: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    name: 'code',
    length: 10,
  })
  code: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'validity',
  })
  validity: string;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'active',
  })
  active: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'score',
  })
  score: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'activity_id',
    length: 36,
  })
  activityId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relação com Activity (1,1)
  @ManyToOne(() => Activity, (activity) => activity.codes)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  // Relação com Checkin (0,n)
  @OneToMany(() => Checkin, (checkin) => checkin.code)
  checkins: Checkin[];
}
