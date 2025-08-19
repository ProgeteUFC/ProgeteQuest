import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassTable1748900621430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.class (
                class_id VARCHAR(36) NOT NULL,
                teacher_id VARCHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                PRIMARY KEY (class_id),
                FOREIGN KEY (teacher_id) REFERENCES public.teacher(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.class;');
  }
}
