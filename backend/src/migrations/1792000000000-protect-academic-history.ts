import { MigrationInterface, QueryRunner } from 'typeorm';

interface SavedConstraint {
  table_name: string;
  constraint_name: string;
  definition: string;
}
const quote = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;

export class ProtectAcademicHistory1792000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Guarda as definições originais para um rollback exato, inclusive nomes personalizados.
    await queryRunner.query(`CREATE TABLE public.academic_history_fk_backup (
      table_name text NOT NULL, constraint_name text NOT NULL, definition text NOT NULL,
      PRIMARY KEY (table_name, constraint_name)
    )`);
    const constraints: SavedConstraint[] = await queryRunner.query(`
      SELECT t.relname AS table_name, c.conname AS constraint_name,
             pg_get_constraintdef(c.oid) AS definition
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE c.contype = 'f' AND c.confdeltype = 'c' AND n.nspname = 'public'
        AND t.relname IN ('teacher','student','class','student_class','assessment','activity','code','checkin','forum','topic','post')
    `);
    for (const item of constraints) {
      await queryRunner.query(
        'INSERT INTO public.academic_history_fk_backup VALUES ($1, $2, $3)',
        [item.table_name, item.constraint_name, item.definition],
      );
      await this.replace(
        queryRunner,
        item,
        item.definition.replace(/ON DELETE CASCADE/gi, 'ON DELETE RESTRICT'),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const constraints: SavedConstraint[] = await queryRunner.query(
      'SELECT * FROM public.academic_history_fk_backup ORDER BY table_name, constraint_name',
    );
    for (const item of constraints)
      await this.replace(queryRunner, item, item.definition);
    await queryRunner.query('DROP TABLE public.academic_history_fk_backup');
  }

  private async replace(
    queryRunner: QueryRunner,
    item: SavedConstraint,
    definition: string,
  ) {
    const table = `public.${quote(item.table_name)}`;
    await queryRunner.query(
      `ALTER TABLE ${table} DROP CONSTRAINT ${quote(item.constraint_name)}`,
    );
    await queryRunner.query(
      `ALTER TABLE ${table} ADD CONSTRAINT ${quote(item.constraint_name)} ${definition}`,
    );
  }
}
