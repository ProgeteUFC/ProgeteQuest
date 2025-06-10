import { Class } from 'src/class/entities/class.entity';
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
export class class {
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

  @ManyToOne(() => Class, (user) => user.teachers)
  user?: Class;
}
