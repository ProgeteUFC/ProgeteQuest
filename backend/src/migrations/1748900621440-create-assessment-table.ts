import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentTable1748900621440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.assessment (
                assessment_id VARCHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                class_id VARCHAR(36) NOT NULL,
                PRIMARY KEY (assessment_id),
                FOREIGN KEY (class_id) REFERENCES public.class(class_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.assessment;');
  }
}
