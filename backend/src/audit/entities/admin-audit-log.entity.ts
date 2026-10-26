import { User } from 'src/user/entities/user.entity';
import { AuditAction } from 'src/Enums/audit-action.enum';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('admin_audit_log')
export class AdminAuditLog {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'audit_id',
    length: 36,
  })
  auditId: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'admin_id',
    length: 36,
  })
  adminId: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'admin_id_snapshot',
    length: 36,
  })
  adminIdSnapshot: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'target_user_id',
    length: 36,
  })
  targetUserId: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'target_user_id_snapshot',
    length: 36,
  })
  targetUserIdSnapshot: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
    enumName: 'admin_audit_action_enum',
    nullable: false,
    name: 'action',
  })
  action: AuditAction;

  @Column({ type: 'text', nullable: true, name: 'reason' })
  reason: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'changes' })
  changes: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true, name: 'resource_ids' })
  resourceIds: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admin_id', referencedColumnName: 'userId' })
  admin?: User | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_user_id', referencedColumnName: 'userId' })
  targetUser?: User | null;
}
