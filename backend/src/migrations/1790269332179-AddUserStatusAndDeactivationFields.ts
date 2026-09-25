import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStatusAndDeactivationFields1790270000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_status_enum'
        ) THEN
          CREATE TYPE user_status_enum AS ENUM ('active', 'inactive');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD COLUMN IF NOT EXISTS "status" user_status_enum;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "status" SET DEFAULT 'active';
    `);

    await queryRunner.query(`
      UPDATE public."user"
      SET "status" = 'active'
      WHERE "status" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "status" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD COLUMN IF NOT EXISTS "deactivated_at" TIMESTAMP;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD COLUMN IF NOT EXISTS "deactivated_by" VARCHAR(36);
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD COLUMN IF NOT EXISTS "deactivation_reason" TEXT;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD CONSTRAINT fk_user_deactivated_by
        FOREIGN KEY ("deactivated_by")
        REFERENCES public."user"(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public."user"
      DROP CONSTRAINT IF EXISTS fk_user_deactivated_by;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      DROP COLUMN IF EXISTS "deactivation_reason";
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      DROP COLUMN IF EXISTS "deactivated_by";
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      DROP COLUMN IF EXISTS "deactivated_at";
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      DROP COLUMN IF EXISTS "status";
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS user_status_enum;
    `);
  }
}
