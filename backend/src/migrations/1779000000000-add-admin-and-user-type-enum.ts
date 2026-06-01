import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminAndUserTypeEnum1779000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_type_enum'
        ) THEN
          CREATE TYPE user_type_enum AS ENUM ('student', 'teacher', 'admin');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ADD COLUMN IF NOT EXISTS "type" user_type_enum;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "type" TYPE user_type_enum
      USING lower(("type")::text)::user_type_enum;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "type" SET DEFAULT 'student';
    `);

    await queryRunner.query(`
      UPDATE public."user"
      SET "type" = 'student'
      WHERE "type" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "type" SET NOT NULL;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.admin (
        user_id VARCHAR(36) PRIMARY KEY,
        CONSTRAINT fk_admin_user
          FOREIGN KEY (user_id)
          REFERENCES public."user"(user_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS public.admin;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "type" DROP DEFAULT;
    `);

    await queryRunner.query(`
      ALTER TABLE public."user"
      ALTER COLUMN "type" TYPE VARCHAR(20)
      USING ("type")::text;
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS user_type_enum;
    `);
  }
}
