import { Activity } from 'src/activity/entities/activity.entity';
import { Code } from 'src/code/entities/code.entity';
import { Student } from 'src/student/entities/student.entity';
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
export class Checkin {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'checkin_id',
    length: 36,
  })
  checkinId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'activity_id',
    length: 36,
  })
  activityId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'student_id',
    length: 36,
  })
  studentId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'code_id',
    length: 36,
  })
  codeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relação com Activity (1,1)
  @ManyToOne(() => Activity, (activity) => activity.checkins, {
    nullable: false,
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  // Relação com Student (1,1)
  @ManyToOne(() => Student, (student) => student.checkins, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  // Relação com Code (1,1)
  @ManyToOne(() => Code, (code) => code.checkins)
  @JoinColumn({ name: 'code_id' })
  code: Code;
}
