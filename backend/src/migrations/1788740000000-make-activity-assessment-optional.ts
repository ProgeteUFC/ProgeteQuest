import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeActivityAssessmentOptional1788740000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE public.activity ALTER COLUMN assessment_id DROP NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE public.activity ALTER COLUMN assessment_id SET NOT NULL',
    );
  }
}
