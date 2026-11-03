export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DEACTIVATED"
  | "USER_REACTIVATED"
  | "PASSWORD_RESET"
  | "CLASSES_TRANSFERRED"
  | "USER_PERMANENTLY_DELETED";

/* name e email ficam null quando o usuário já foi removido; userId vem do snapshot do log. */
export interface AuditUserRef {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface AuditFieldChange {
  before: unknown;
  after: unknown;
}

export interface AuditLogEntry {
  auditId: string;
  action: AuditAction;
  createdAt: string;
  admin: AuditUserRef;
  targetUser: AuditUserRef;
  reason: string | null;
  changes: Record<string, unknown> | null;
  resourceIds: Record<string, unknown> | null;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
}

export interface AuditLogPage {
  data: AuditLogEntry[];
  meta: { page: number; limit: number; totalItems: number; totalPages: number };
}
