import type { AuditAction, AuditFieldChange, AuditUserRef } from "../../../types/audit";

const ACTION_LABELS: Record<AuditAction, string> = {
  USER_CREATED: "Usuário cadastrado",
  USER_UPDATED: "Dados do usuário alterados",
  USER_DEACTIVATED: "Usuário desativado",
  USER_REACTIVATED: "Usuário reativado",
  PASSWORD_RESET: "Senha redefinida",
  CLASSES_TRANSFERRED: "Turmas transferidas",
  USER_PERMANENTLY_DELETED: "Usuário excluído definitivamente",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Nome",
  email: "E-mail",
  registrationStudent: "Matrícula",
  registrationTeacher: "SIAPE",
  type: "Perfil",
  status: "Status",
  deactivatedAt: "Desativado em",
  deactivatedBy: "Desativado por (ID)",
  deactivationReason: "Motivo da desativação",
  teacherId: "Professor responsável (ID)",
  credentialsChanged: "Credenciais alteradas",
  userId: "Usuário (ID)",
};

const RESOURCE_LABELS: Record<string, string> = {
  userId: "Usuário (ID)",
  sourceTeacherId: "Professor de origem (ID)",
  destinationTeacherId: "Professor de destino (ID)",
  classIds: "Turmas (IDs)",
  preservedRelations: "Vínculos preservados",
  classes: "Turmas",
  assessments: "Avaliações",
  activities: "Atividades",
  enrollments: "Matrículas",
  checkins: "Check-ins",
  forums: "Fóruns",
  topics: "Tópicos",
  posts: "Postagens",
};

const PROFILE_LABELS: Record<string, string> = {
  student: "Aluno",
  teacher: "Professor",
  admin: "Administrador",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export function actionLabel(action: string) {
  return ACTION_LABELS[action as AuditAction] ?? `Ação não reconhecida (${action})`;
}

export function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? key;
}

export function resourceLabel(key: string) {
  return RESOURCE_LABELS[key] ?? FIELD_LABELS[key] ?? key;
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR");
}

export function formatAuditValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (key === "status" && typeof value === "string") {
    return value === "active" ? "Ativo" : value === "inactive" ? "Inativo" : value;
  }
  if (key === "type" && typeof value === "string") return PROFILE_LABELS[value] ?? value;
  if (typeof value === "string" && ISO_DATE.test(value)) return formatDateTime(value);
  if (Array.isArray(value)) {
    return value.length ? value.map((item) => formatAuditValue("", item)).join(", ") : "—";
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([innerKey, innerValue]) => `${resourceLabel(innerKey)}: ${formatAuditValue(innerKey, innerValue)}`)
      .join("; ");
  }
  return String(value);
}

export function isFieldChange(value: unknown): value is AuditFieldChange {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "before" in value &&
    "after" in value
  );
}

export function userRefName(ref: AuditUserRef) {
  return ref.name ?? "Usuário removido";
}
