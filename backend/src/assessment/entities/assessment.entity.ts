import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Class } from '../../class/entities/class.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity({ name: 'assessment' })
export class Assessment {
  @PrimaryColumn({
    type: 'varchar',
    length: 36,
    name: 'assessment_id',
  })
  assessmentId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 36,
    name: 'class_id',
  })
  classId: string;

  @ManyToOne(() => Class, (cls) => cls.assessments)
  @JoinColumn({ name: 'class_id' }) 
  class: Class;

  @OneToMany(() => Activity, (activity) => activity.assessment)
  activities: Activity[];
}