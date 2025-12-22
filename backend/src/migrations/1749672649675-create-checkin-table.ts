import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckinTable1749672649675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.checkin (
                checkin_id VARCHAR(36) NOT NULL,
                activity_id VARCHAR(36) NOT NULL,
                student_id VARCHAR(36) NOT NULL,
                code_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                PRIMARY KEY (checkin_id),
                FOREIGN KEY (activity_id) REFERENCES public.activity(activity_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (student_id) REFERENCES public.student(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (code_id) REFERENCES public.code(code_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.checkin;');
  }
}
