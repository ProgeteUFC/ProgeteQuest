import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivityTable1748900621442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.activity (
                activity_id VARCHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                date TIMESTAMP NOT NULL,
                type VARCHAR(20) NOT NULL,
                class_id VARCHAR(36) NOT NULL,
                assessment_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                PRIMARY KEY (activity_id),
                FOREIGN KEY (class_id) REFERENCES public.class(class_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (assessment_id) REFERENCES public.assessment(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.activity;');
  }
}
