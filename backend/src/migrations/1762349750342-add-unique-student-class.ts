import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueStudentClass1762349750342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Usamos as colunas "student_id" e "class_id" como estão no banco
    await queryRunner.query(
      `ALTER TABLE "student_class" ADD CONSTRAINT "UQ_STUDENT_CLASS" UNIQUE ("student_id", "class_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL para REMOVER a restrição unique
    await queryRunner.query(
      `ALTER TABLE "student_class" DROP CONSTRAINT "UQ_STUDENT_CLASS"`,
    );
  }
}
