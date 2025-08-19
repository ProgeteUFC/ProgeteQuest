import { Activity } from 'src/activity/entities/activity.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'class_id',
    length: 36,
  })
  classId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'teacher_id',
    length: 36,
  })
  teacherId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'name',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'join_code',
    length: 10,
    unique: true,
  })
  joinCode: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relação com Teacher (1,1)
  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  // Relação com Assessment (0,n)
  @OneToMany(() => Assessment, (assessment) => assessment.class)
  assessments: Assessment[];

  // Relação com Activity (0,n)
  @OneToMany(() => Activity, (activity) => activity.class)
  activities: Activity[];

  // Relação com StudentClass (0,n)
  @OneToMany(() => StudentClass, (studentClass) => studentClass.class)
  studentClasses: StudentClass[];
}
