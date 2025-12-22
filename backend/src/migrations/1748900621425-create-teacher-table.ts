import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeacherTable1748900621425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.teacher (
        user_id VARCHAR(36) NOT NULL,
        
       registration_teacher VARCHAR(6) UNIQUE NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES public.user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
