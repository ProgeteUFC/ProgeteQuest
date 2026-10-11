import { ProtectAcademicHistory1792000000000 } from '../migrations/1792000000000-protect-academic-history';

describe('Migration de proteção do histórico', () => {
  const original = {
    table_name: 'class',
    constraint_name: 'class_teacher_id_fkey',
    definition:
      'FOREIGN KEY (teacher_id) REFERENCES teacher(user_id) ON UPDATE CASCADE ON DELETE CASCADE',
  };
  const migration = new ProtectAcademicHistory1792000000000();
  it('up troca apenas DELETE CASCADE por RESTRICT e salva a definição original', async () => {
    const query = jest.fn(async (sql: string) =>
      sql.includes('FROM pg_constraint') ? [original] : [],
    );
    await migration.up({ query } as never);
    expect(query).toHaveBeenCalledWith(
      'INSERT INTO public.academic_history_fk_backup VALUES ($1, $2, $3)',
      [original.table_name, original.constraint_name, original.definition],
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('ON UPDATE CASCADE ON DELETE RESTRICT'),
    );
    expect(
      query.mock.calls.some(([sql]) => /DELETE FROM|TRUNCATE/.test(sql)),
    ).toBe(false);
  });
  it('down restaura exatamente a constraint original', async () => {
    const query = jest.fn(async (sql: string) =>
      sql.startsWith('SELECT *') ? [original] : [],
    );
    await migration.down({ query } as never);
    expect(query).toHaveBeenCalledWith(
      `ALTER TABLE public."class" ADD CONSTRAINT "class_teacher_id_fkey" ${original.definition}`,
    );
    expect(query).toHaveBeenCalledWith(
      'DROP TABLE public.academic_history_fk_backup',
    );
  });
});
