import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCodeTable1748900621445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.code (
                code_id VARCHAR(36) NOT NULL,
                code VARCHAR(10) UNIQUE NOT NULL,
                validity TIMESTAMP NOT NULL,
                active BOOLEAN NOT NULL,
                score INT NOT NULL,
                activity_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                PRIMARY KEY (code_id),
                FOREIGN KEY (activity_id) REFERENCES public.activity(activity_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.code;');
  }
}
