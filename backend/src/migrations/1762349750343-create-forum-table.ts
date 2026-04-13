import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateForumTable1762349750343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.forum (
        forum_id VARCHAR(36) NOT NULL,
        turma_id VARCHAR(36) NOT NULL UNIQUE,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        PRIMARY KEY (forum_id),
        FOREIGN KEY (turma_id) REFERENCES public.class(class_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.forum;');
  }
}
