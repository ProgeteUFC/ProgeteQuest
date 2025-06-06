import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from '../../class/entities/class.entity'; 
import { Assessment } from '../../assessment/entities/assessment.entity';


export enum ActivityType {
  ACTIVITY = 'activity',
  SEMINAR = 'seminar',
  ATTENDANCE = 'attendance',
}

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


  @ManyToOne(() => Class, (cls) => cls.activities)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Assessment, (assessment) => assessment.activities)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;
}