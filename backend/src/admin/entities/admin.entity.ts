import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn({
    type: 'varchar',
    name: 'user_id',
    length: 36,
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.admins, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}