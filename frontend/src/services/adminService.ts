import axios from "axios";
import type { AdminFormUserData, CreatedUserResponse } from "../types/user";
import { mockUsers } from "../mocks/users.mock";

const API_URL = import.meta.env.VITE_API_URL;
const DELAY_MS = 600;

export interface ManagedUser {
  userId: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  status: "active" | "inactive";
  registrationStudent?: string;
  registrationTeacher?: string;
  createdAt: string;
}

export type ManagedUserUpdate = Partial<
  Pick<
    ManagedUser,
    "name" | "email" | "registrationStudent" | "registrationTeacher"
  >
> & { password?: string };

function authorization() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Usuário não autenticado. Faça login novamente.");
  return { Authorization: `Bearer ${token}` };
}

export function adminErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Não foi possível conectar ao servidor.";
    if (error.response.status === 403)
      return "Acesso negado. Entre com uma conta de administrador ativa.";
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}

function delay(ms = DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

/* Gera uma senha temporária */
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

export const adminService = {
  async listarUsuarios(): Promise<ManagedUser[]> {
    const response = await axios.get<ManagedUser[]>(`${API_URL}/admin/users`, {
      headers: authorization(),
    });
    return response.data;
  },

  async buscarUsuario(userId: string): Promise<ManagedUser> {
    const response = await axios.get<ManagedUser>(
      `${API_URL}/admin/users/${userId}`,
      { headers: authorization() },
    );
    return response.data;
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
  /* Cadastro administrativo existente (mockado) */
  async cadastrarUsuario(
    data: AdminFormUserData,
  ): Promise<CreatedUserResponse> {
    await delay();

    const emailJaExiste = mockUsers.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (emailJaExiste) {
      throw new Error("E-mail já cadastrado.");
    }

    const novoUsuario: CreatedUserResponse = {
      userId: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      type: data.type,
      registrationStudent:
        data.type === "student" ? data.registrationStudent : undefined,
      registrationTeacher:
        data.type === "teacher" ? data.registrationTeacher : undefined,
      temporaryPassword: data.password,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(novoUsuario);
    return novoUsuario;
  },

  /* Consulta real ao dashboard administrativo */
  async buscarDashboard(): Promise<AdminDashboard> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await axios.get<AdminDashboard>(
      `${API_URL}/admin/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  },
};
