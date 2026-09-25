import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveToUser1790298359845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.user
      ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE public.user
      DROP COLUMN IF EXISTS active;
    `);
  }
}
