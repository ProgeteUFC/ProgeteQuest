import { Class } from 'src/class/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class StudentClass {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'student_class_id',
    length: 36,
  })
  studentClassId: string;

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
    name: 'class_id',
    length: 36,
  })
  classId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relação com Class (1,1)
  @ManyToOne(() => Class, (classEntity) => classEntity.studentClasses)
  class: Class;

  // Relação com Student (1,1)
  @ManyToOne(() => Student, (student) => student.studentClasses)
  student: Student;
}
