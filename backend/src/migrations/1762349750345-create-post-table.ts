import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1762349750345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.post (
        post_id VARCHAR(36) NOT NULL,
        topic_id VARCHAR(36) NOT NULL,
        autor_id VARCHAR(36) NOT NULL,
        mensagem TEXT NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        PRIMARY KEY (post_id),
        FOREIGN KEY (topic_id) REFERENCES public.topic(topic_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (autor_id) REFERENCES public.user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX idx_post_topic_id ON public.post(topic_id);
      CREATE INDEX idx_post_autor_id ON public.post(autor_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.post;');
  }
}
