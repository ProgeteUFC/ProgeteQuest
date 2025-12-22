import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentClassTable1748900621435
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.student_class (
                student_class_id VARCHAR(36) NOT NULL,
                student_id VARCHAR(36) NOT NULL,
                class_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
                PRIMARY KEY (student_class_id),
                FOREIGN KEY (student_id) REFERENCES public.student(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (class_id) REFERENCES public.class(class_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.student_class;');
  }
}
