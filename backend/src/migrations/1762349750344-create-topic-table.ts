import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTopicTable1762349750344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.topic (
        topic_id VARCHAR(36) NOT NULL,
        forum_id VARCHAR(36) NOT NULL,
        autor_id VARCHAR(36) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        PRIMARY KEY (topic_id),
        FOREIGN KEY (forum_id) REFERENCES public.forum(forum_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (autor_id) REFERENCES public.user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX idx_topic_forum_id ON public.topic(forum_id);
      CREATE INDEX idx_topic_autor_id ON public.topic(autor_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.topic;');
  }
}
