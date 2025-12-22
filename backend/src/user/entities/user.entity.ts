import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'user_id',
    length: 36,
  })
  userId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'name',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'email',
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'password',
  })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teachers?: Teacher[];

  @OneToMany(() => Student, (student) => student.user)
  students?: Student[];
}
