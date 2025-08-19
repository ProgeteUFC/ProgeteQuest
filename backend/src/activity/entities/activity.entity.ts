import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Assessment } from '../../assessment/entities/assessment.entity';
import { Class } from 'src/class/entities/class.entity';
import { Code } from 'src/code/entities/code.entity';
import { Checkin } from 'src/checkin/entities/checkin.entity';
import { ActivityType } from 'src/Enums/activity.enum';

@Entity({ name: 'activity' })
export class Activity {
  @PrimaryColumn({
    type: 'varchar',
    length: 36,
    name: 'activity_id',
  })
  activityId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'enum',
    enum: ActivityType,
    nullable: false,
  })
  type: ActivityType;

  @Column({
    type: 'varchar',
    length: 36,
    name: 'class_id',
  })
  classId: string;

  @Column({
    type: 'varchar',
    length: 36,
    name: 'assessment_id',
  })
  assessmentId: string;

  // Relação com Class (1,1)
  @ManyToOne(() => Class, (cls) => cls.activities)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  // Relação com Assessment (1,1)
  @ManyToOne(() => Assessment, (assessment) => assessment.activities)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  //Relação com Code (0,n)
  @OneToMany(() => Code, (code) => code.activity)
  codes: Code[];

  // Relação com Checkin (0,n)
  @OneToMany(() => Checkin, (checkin) => checkin.activity)
  checkins: Checkin[];
}
