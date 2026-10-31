export type AuditFieldChange = {
  before: unknown;
  after: unknown;
};

export type AuditDiffMap = Record<string, AuditFieldChange>;

function normalizeAuditValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value ?? null;
}

export function buildChanges(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
  allowedFields: readonly string[],
): AuditDiffMap {
  const result: AuditDiffMap = {};
  const safeBefore = before ?? {};
  const safeAfter = after ?? {};

  for (const field of allowedFields) {
    const beforeValue = normalizeAuditValue(safeBefore[field]);
    const afterValue = normalizeAuditValue(safeAfter[field]);

    if (beforeValue === afterValue) {
      continue;
    }

    result[field] = {
      before: beforeValue,
      after: afterValue,
    };
  }

  return result;
}
