import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminAuditLogTable1793000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE public.admin_audit_action_enum AS ENUM (
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DEACTIVATED',
        'USER_REACTIVATED',
        'PASSWORD_RESET',
        'CLASSES_TRANSFERRED',
        'USER_PERMANENTLY_DELETED'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE public.admin_audit_log (
        audit_id VARCHAR(36) NOT NULL,
        admin_id VARCHAR(36),
        admin_id_snapshot VARCHAR(36) NOT NULL,
        target_user_id VARCHAR(36),
        target_user_id_snapshot VARCHAR(36) NOT NULL,
        action public.admin_audit_action_enum NOT NULL,
        reason TEXT,
        changes JSONB,
        resource_ids JSONB,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        PRIMARY KEY (audit_id),
        CONSTRAINT fk_admin_audit_log_admin
          FOREIGN KEY (admin_id) REFERENCES public."user"(user_id)
          ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_admin_audit_log_target_user
          FOREIGN KEY (target_user_id) REFERENCES public."user"(user_id)
          ON DELETE SET NULL ON UPDATE CASCADE
      );
      CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
      CREATE INDEX idx_admin_audit_log_target_user_id ON public.admin_audit_log(target_user_id);
      CREATE INDEX idx_admin_audit_log_action ON public.admin_audit_log(action);
      CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS public.admin_audit_log;');
    await queryRunner.query(
      'DROP TYPE IF EXISTS public.admin_audit_action_enum;',
    );
  }
}
