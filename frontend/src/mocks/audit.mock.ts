import type { AuditLogEntry, AuditLogPage, AuditLogQuery } from "../types/audit";

/* Dados simulados enquanto GET /admin/audit-logs não existe. Não usar como solução final. */

const ADMIN = {
  userId: "0b8f6c2e-1d4a-4e8b-9a51-3f2c7d9e1a01",
  name: "Ana Administradora",
  email: "ana.admin@example.com",
};

const OUTRO_ADMIN = {
  userId: "5c2a9e7b-4f1d-4a3c-8e62-9b1d0f4a7c02",
  name: "Bruno Gestor",
  email: "bruno.gestor@example.com",
};

const ALUNO = {
  userId: "a1f4c8d2-7b3e-4c9a-b5d6-1e2f3a4b5c03",
  name: "Carla Mendes",
  email: "carla.mendes@example.com",
};

const PROFESSOR = {
  userId: "b7e2d9f1-3c4a-4b8e-9f2d-6a1c5e8b9d04",
  name: "Diego Ramos",
  email: "diego.ramos@example.com",
};

const PROFESSOR_DESTINO = {
  userId: "c3d8a1e5-9f2b-4e7c-a4d1-8b6f2c9e3a05",
  name: "Elisa Prado",
  email: "elisa.prado@example.com",
};

const USUARIO_EXCLUIDO_ID = "d9a2f7c4-1e8b-4d3a-b6c5-2f9e1a7d4b06";

export const mockAuditLogs: AuditLogEntry[] = [
  {
    auditId: "e1000000-0000-4000-8000-000000000001",
    action: "USER_PERMANENTLY_DELETED",
    createdAt: "2026-11-03T14:20:00.000Z",
    admin: ADMIN,
    targetUser: { userId: USUARIO_EXCLUIDO_ID, name: null, email: null },
    reason: "Conta duplicada, após revisão dos dados vinculados.",
    changes: {
      userId: USUARIO_EXCLUIDO_ID,
      name: "Felipe Duplicado",
      email: "felipe.duplicado@example.com",
      type: "student",
    },
    resourceIds: { userId: USUARIO_EXCLUIDO_ID },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000002",
    action: "CLASSES_TRANSFERRED",
    createdAt: "2026-11-02T18:05:00.000Z",
    admin: ADMIN,
    targetUser: PROFESSOR,
    reason: null,
    changes: { teacherId: { before: PROFESSOR.userId, after: PROFESSOR_DESTINO.userId } },
    resourceIds: {
      sourceTeacherId: PROFESSOR.userId,
      destinationTeacherId: PROFESSOR_DESTINO.userId,
      classIds: [
        "f1a2b3c4-d5e6-4f70-8192-a3b4c5d6e701",
        "f1a2b3c4-d5e6-4f70-8192-a3b4c5d6e702",
      ],
      preservedRelations: { classes: 2, activities: 5, enrollments: 31, checkins: 120 },
    },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000003",
    action: "USER_DEACTIVATED",
    createdAt: "2026-11-02T09:40:00.000Z",
    admin: OUTRO_ADMIN,
    targetUser: PROFESSOR,
    reason: "Professor desligado da instituição.",
    changes: {
      status: { before: "active", after: "inactive" },
      deactivatedAt: { before: null, after: "2026-11-02T09:40:00.000Z" },
      deactivatedBy: { before: null, after: OUTRO_ADMIN.userId },
      deactivationReason: { before: null, after: "Professor desligado da instituição." },
    },
    resourceIds: { userId: PROFESSOR.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000004",
    action: "PASSWORD_RESET",
    createdAt: "2026-11-01T16:15:00.000Z",
    admin: ADMIN,
    targetUser: ALUNO,
    reason: "Aluna perdeu o acesso ao e-mail cadastrado.",
    changes: { credentialsChanged: true },
    resourceIds: { userId: ALUNO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000005",
    action: "USER_UPDATED",
    createdAt: "2026-11-01T11:02:00.000Z",
    admin: ADMIN,
    targetUser: ALUNO,
    reason: null,
    changes: {
      email: { before: "carla.m@example.com", after: "carla.mendes@example.com" },
      registrationStudent: { before: "123450", after: "123456" },
    },
    resourceIds: { userId: ALUNO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000006",
    action: "USER_REACTIVATED",
    createdAt: "2026-10-31T15:30:00.000Z",
    admin: OUTRO_ADMIN,
    targetUser: ALUNO,
    reason: null,
    changes: {
      status: { before: "inactive", after: "active" },
      deactivatedAt: { before: "2026-10-28T10:00:00.000Z", after: null },
      deactivatedBy: { before: ADMIN.userId, after: null },
      deactivationReason: { before: "Matrícula trancada.", after: null },
    },
    resourceIds: { userId: ALUNO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000007",
    action: "USER_DEACTIVATED",
    createdAt: "2026-10-28T10:00:00.000Z",
    admin: ADMIN,
    targetUser: ALUNO,
    reason: "Matrícula trancada.",
    changes: {
      status: { before: "active", after: "inactive" },
      deactivatedAt: { before: null, after: "2026-10-28T10:00:00.000Z" },
      deactivatedBy: { before: null, after: ADMIN.userId },
      deactivationReason: { before: null, after: "Matrícula trancada." },
    },
    resourceIds: { userId: ALUNO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000008",
    action: "USER_CREATED",
    createdAt: "2026-10-27T13:45:00.000Z",
    admin: ADMIN,
    targetUser: PROFESSOR_DESTINO,
    reason: null,
    changes: {
      name: { before: null, after: PROFESSOR_DESTINO.name },
      email: { before: null, after: PROFESSOR_DESTINO.email },
      registrationTeacher: { before: null, after: "654321" },
      type: { before: null, after: "teacher" },
      status: { before: null, after: "active" },
    },
    resourceIds: { userId: PROFESSOR_DESTINO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000009",
    action: "USER_UPDATED",
    createdAt: "2026-10-26T08:20:00.000Z",
    admin: OUTRO_ADMIN,
    targetUser: PROFESSOR,
    reason: null,
    changes: { name: { before: "Diego R.", after: PROFESSOR.name } },
    resourceIds: { userId: PROFESSOR.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000010",
    action: "USER_CREATED",
    createdAt: "2026-10-25T17:10:00.000Z",
    admin: ADMIN,
    targetUser: ALUNO,
    reason: null,
    changes: {
      name: { before: null, after: ALUNO.name },
      email: { before: null, after: "carla.m@example.com" },
      registrationStudent: { before: null, after: "123450" },
      type: { before: null, after: "student" },
      status: { before: null, after: "active" },
    },
    resourceIds: { userId: ALUNO.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000011",
    action: "USER_CREATED",
    createdAt: "2026-10-24T12:00:00.000Z",
    admin: ADMIN,
    targetUser: PROFESSOR,
    reason: null,
    changes: {
      name: { before: null, after: "Diego R." },
      email: { before: null, after: PROFESSOR.email },
      registrationTeacher: { before: null, after: "111222" },
      type: { before: null, after: "teacher" },
      status: { before: null, after: "active" },
    },
    resourceIds: { userId: PROFESSOR.userId },
  },
  {
    auditId: "e1000000-0000-4000-8000-000000000012",
    action: "USER_CREATED",
    createdAt: "2026-10-23T09:30:00.000Z",
    admin: ADMIN,
    targetUser: OUTRO_ADMIN,
    reason: null,
    changes: {
      name: { before: null, after: OUTRO_ADMIN.name },
      email: { before: null, after: OUTRO_ADMIN.email },
      type: { before: null, after: "admin" },
      status: { before: null, after: "active" },
    },
    resourceIds: { userId: OUTRO_ADMIN.userId },
  },
];

export async function listarAuditoriaSimulada({
  page = 1,
  limit = 10,
}: AuditLogQuery = {}): Promise<AuditLogPage> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const ordered = [...mockAuditLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totalItems = ordered.length;
  const start = (page - 1) * limit;
  return {
    data: ordered.slice(start, start + limit),
    meta: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}
