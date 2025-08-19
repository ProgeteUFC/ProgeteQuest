import { Checkin } from 'src/checkin/entities/checkin.entity';
import { StudentClass } from 'src/student_class/entities/studentClass.entity';
import { User } from 'src/user/entities/user.entity';
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
export class Student {
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
    name: 'registration_student',
    length: 6,
  })
  registrationStudent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relação com User (1,1)
  @ManyToOne(() => User, (user) => user.students)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user?: User;

  // Relação com StudentClass (0,n)
  @OneToMany(() => StudentClass, (studentClass) => studentClass.student)
  studentClasses: StudentClass[];

  // ATIVAR DEPOIS QUE CRIAR A ENTITY CHECKIN:

  //Relação com Checkin (0,n)
  @OneToMany(() => Checkin, (checkin) => checkin.student)
  checkins: Checkin[];
}
