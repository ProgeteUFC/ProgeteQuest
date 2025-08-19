import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodeColumnInClass1754853860258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.class
            ADD COLUMN join_code VARCHAR(10) UNIQUE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.class
            DROP COLUMN join_code;
        `);
  }
}
