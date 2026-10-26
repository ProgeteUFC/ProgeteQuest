import type { ManagedUser, UserDeletionImpact } from "../../services/adminService";

const counts = ["classesAsStudent", "classesAsTeacher", "assessments", "activities", "enrollments", "checkins", "forums", "forumTopics", "forumPosts", "codes"] as const;

export function validImpact(value: unknown, user: Pick<ManagedUser, "userId" | "type">): value is UserDeletionImpact {
  if (!value || typeof value !== "object") return false;
  const data = value as UserDeletionImpact;
  return data.userId === user.userId && data.type === user.type &&
    typeof data.hasDependencies === "boolean" && typeof data.canDelete === "boolean" &&
    Array.isArray(data.blockedReasons) && data.blockedReasons.every(reason => typeof reason === "string") &&
    counts.every(key => Number.isSafeInteger(data[key]) && data[key] >= 0);
}

export function canProceed(value: unknown, user: Pick<ManagedUser, "userId" | "type">): value is UserDeletionImpact {
  return validImpact(value, user) && value.canDelete === true && value.blockedReasons.length === 0;
}

export function impactItems(impact: UserDeletionImpact): [string, number][] {
  const common: [string, number][] = [["Check-ins", impact.checkins], ["Tópicos", impact.forumTopics], ["Mensagens", impact.forumPosts]];
  if (impact.type === "teacher") return [["Turmas", impact.classesAsTeacher], ["Avaliações", impact.assessments], ["Atividades", impact.activities], ["Matrículas", impact.enrollments], common[0], ["Fóruns", impact.forums], ...common.slice(1)];
  if (impact.type === "student") return [["Turmas", impact.classesAsStudent], ...common];
  return [];
}
