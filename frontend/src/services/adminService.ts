import axios from "axios";
import type { AdminFormUserData, CreatedUserResponse } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;
const CREATE_USER_PATH = "/admin/users";

export interface ManagedUser {
  userId: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  registrationStudent?: string;
  registrationTeacher?: string;
  createdAt: string;
  updatedAt?: string;
  deactivatedAt?: string | null;
  deactivatedBy?: string | null;
  deactivationReason?: string | null;
}

export interface ManagedUsersQuery {
  search?: string;
  type?: ManagedUser["type"];
  status?: ManagedUser["status"];
  page?: number;
  limit?: number;
}

export interface ManagedUsersPage {
  data: ManagedUser[];
  meta: { page: number; limit: number; totalItems: number; totalPages: number };
}

interface ListedUser extends Omit<ManagedUser, "registrationStudent" | "registrationTeacher"> {
  registration: string | null;
}

export type ManagedUserUpdate = Partial<
  Pick<
    ManagedUser,
    "name" | "email" | "registrationStudent" | "registrationTeacher"
  >
>;

export interface UserDeletionImpact {
  userId: string;
  type: ManagedUser["type"];
  impact: { classes?: number; assessments?: number; activities?: number; enrollments?: number; checkins?: number; forums?: number; topics?: number; posts?: number };
  classesAsStudent: number;
  classesAsTeacher: number;
  activities: number;
  assessments: number;
  checkins: number;
  forumTopics: number;
  forumPosts: number;
  enrollments: number;
  forums: number;
  codes: number;
  hasDependencies: boolean;
  canDelete: boolean;
  blockedReasons: string[];
}

export interface PermanentDeletePayload {
  /** Frase digitada pelo administrador: "EXCLUIR DEFINITIVAMENTE". */
  confirmation: string;
  reason: string;
  adminPassword: string;
}

/** Resposta do DELETE /admin/users/:id/permanent. Enquanto `executed` for false, nada foi excluído. */
export interface PermanentDeleteResult {
  userId: string;
  executed: boolean;
  validatedAt?: string;
  validatedBy?: string;
  reason?: string;
  impact?: UserDeletionImpact;
  pendingStep?: string;
}

export interface ClassTransferResult {
  sourceTeacherId: string;
  destinationTeacherId: string;
  transferredClasses: { classId: string; name: string }[];
  preservedRelations: { enrollments: number; assessments: number; activities: number; forums: number };
  transferredAt: string;
}

/* Só deve virar true quando o endpoint estiver liberado com segurança no backend. */
export const PERMANENT_DELETE_ENABLED = false;

export interface DashboardUser {
  userId: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  deactivatedAt: string | null;
}

export interface AdminDashboard {
  students: {
    active: number;
    inactive: number;
  };
  teachers: {
    active: number;
    inactive: number;
  };
  totalClasses: number;
  recentlyDisabledUsers: DashboardUser[];
}

function authorization(token = localStorage.getItem("token")) {
  if (!token) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  return { Authorization: `Bearer ${token}` };
}

export function adminErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    const status = error.response?.status;
    const sessionDenied =
      (status === 401 && (!message || message === "Unauthorized")) ||
      (status === 403 && message === "Forbidden resource");
    if (sessionDenied) {
      return "Acesso negado. Sua sessão expirou, sua conta está inativa ou você não tem permissão.";
    }

    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;

    if (!error.response) {
      return "Não foi possível conectar ao servidor.";
    }

    if (error.response.status === 403) {
      return "Acesso negado. Sua conta pode estar inativa ou sem permissão para esta operação.";
    }
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}

/* Mensagens da exclusão definitiva: senha incorreta, usuário ativo e dependências. */
export function permanentDeleteErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const raw = data?.message;
    const message = Array.isArray(raw) ? raw.join(" ") : typeof raw === "string" ? raw : "";

    if (status === 401) {
      return !message || message === "Unauthorized"
        ? "Senha de administrador incorreta ou sessão expirada. Confira a senha e tente novamente."
        : message;
    }

    if (status === 409) {
      // O 409 de dependências também devolve `impact.blockedReasons` com os motivos.
      const reasons = Array.isArray(data?.impact?.blockedReasons)
        ? data.impact.blockedReasons.filter((item: unknown) => typeof item === "string").join(" ")
        : "";
      const base =
        message ||
        "Não foi possível excluir. O usuário precisa estar inativo e sem dependências que impeçam a exclusão.";
      return reasons ? `${base} ${reasons}` : base;
    }

    if (status === 400) {
      return message || "Não foi possível excluir. Confira os dados informados e tente novamente.";
    }
  }

  return adminErrorMessage(error);
}

/* Gera uma senha temporária. */
export function gerarSenhaTemporaria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let senha = "";
  const limit = 256 - (256 % chars.length);

  while (senha.length < 12) {
    const value = crypto.getRandomValues(new Uint8Array(1))[0];

    if (value < limit) {
      senha += chars[value % chars.length];
    }
  }

  return senha;
}

/* Converte erros do cadastro em mensagens para o formulário. */
export function mensagemDeErro(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.";
    }

    const { status, data } = err.response;
    const detalhe: string | undefined = Array.isArray(data?.message)
      ? data.message.join(" ")
      : typeof data?.message === "string"
        ? data.message
        : undefined;

    if (status === 401 || status === 403) {
      return "Você não tem permissão para cadastrar usuários ou sua sessão expirou. Faça login novamente como administrador.";
    }

    if (status === 409) {
      return detalhe || "E-mail ou matrícula já em uso.";
    }

    if (status === 400) {
      return detalhe || "Dados inválidos. Confira os campos e tente novamente.";
    }

    return detalhe || "Erro ao cadastrar. Tente novamente.";
  }

  if (err instanceof Error) return err.message;

  return "Erro ao cadastrar. Tente novamente.";
}

export const adminService = {
  async transferirTurmas(teacherId: string, destinationTeacherId: string, classIds: string[]): Promise<ClassTransferResult> {
    const response = await axios.post<ClassTransferResult>(
      `${API_URL}/admin/teachers/${teacherId}/transfer`,
      { destinationTeacherId, classIds },
      { headers: authorization() },
    );
    return response.data;
  },
  async listarUsuarios(query: ManagedUsersQuery = {}): Promise<ManagedUsersPage> {
    const response = await axios.get<{ data: ListedUser[]; meta: ManagedUsersPage["meta"] }>(
      `${API_URL}/admin/users`,
      { headers: authorization(), params: query },
    );

    return {
      meta: response.data.meta,
      data: response.data.data.map(({ registration, ...user }) => ({
        ...user,
        ...(user.type === "student" ? { registrationStudent: registration ?? undefined } : {}),
        ...(user.type === "teacher" ? { registrationTeacher: registration ?? undefined } : {}),
      })),
    };
  },

  async buscarUsuario(userId: string): Promise<ManagedUser> {
    const response = await axios.get<ManagedUser>(
      `${API_URL}/admin/users/${userId}`,
      { headers: authorization() },
    );

    return response.data;
  },

  async consultarImpacto(userId: string, signal?: AbortSignal): Promise<UserDeletionImpact> {
    const response = await axios.get<UserDeletionImpact>(
      `${API_URL}/admin/users/${userId}/deletion-impact`,
      { headers: authorization(), signal },
    );

    return response.data;
  },

  async excluirDefinitivamente(userId: string, payload: PermanentDeletePayload) {
    if (!PERMANENT_DELETE_ENABLED) {
      throw new Error("A exclusão definitiva ainda não está disponível.");
    }

    return axios.delete<PermanentDeleteResult>(`${API_URL}/admin/users/${userId}/permanent`, {
      headers: authorization(),
      data: payload,
    });
  },

  async editarUsuario(userId: string, body: ManagedUserUpdate) {
    return axios.patch(`${API_URL}/admin/users/${userId}`, body, {
      headers: authorization(),
    });
  },

  async desativarUsuario(userId: string, reason: string) {
    return axios.patch(
      `${API_URL}/admin/users/${userId}/deactivate`,
      { reason },
      { headers: authorization() },
    );
  },

  async reativarUsuario(userId: string) {
    return axios.patch(
      `${API_URL}/admin/users/${userId}/activate`,
      {},
      { headers: authorization() },
    );
  },

  async cadastrarUsuario(
    data: AdminFormUserData,
    token?: string,
  ): Promise<CreatedUserResponse> {
    const response = await axios.post<CreatedUserResponse>(
      `${API_URL}${CREATE_USER_PATH}`,
      data,
      { headers: authorization(token) },
    );

    return response.data;
  },

  async buscarDashboard(): Promise<AdminDashboard> {
    const response = await axios.get<AdminDashboard>(
      `${API_URL}/admin/dashboard`,
      { headers: authorization() },
    );

    return response.data;
  },
};
