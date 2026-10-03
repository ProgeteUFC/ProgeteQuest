import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UserType, UserStatus } from 'src/Enums/user.enum';
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

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
    name: 'type',
  })
  type: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    enumName: 'user_status_enum',
    default: UserStatus.ACTIVE,
    nullable: false,
    name: 'status',
  })
  status: UserStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'deactivated_at',
  })
  deactivatedAt: Date | null;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
    name: 'deactivated_by',
  })
  deactivatedBy: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'deactivated_by' })
  deactivatedByUser?: User;

  @Column({
    type: 'text',
    nullable: true,
    name: 'deactivation_reason',
  })
  deactivationReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teachers?: Teacher[];

  @OneToMany(() => Student, (student) => student.user)
  students?: Student[];

  @OneToMany(() => Admin, (admin) => admin.user)
  admins?: Admin[];
}
