import { Class } from 'src/class/entities/class.entity';
import { User } from 'src/user/entities/user.entity';
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
export class Teacher {
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
    name: 'registration_teacher',
    length: 6,
  })
  registrationStudent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relação com User (1,1)
  @ManyToOne(() => User, (user) => user.teachers)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user?: User;

  // Relação com Class (0,n)
  @OneToMany(() => Class, (classEntity) => classEntity.teacher)
  classes: Class[];
}
