import { AdminFormUserData, CreatedUserResponse } from "../types/user";
import { mockUsers } from "../mocks/users.mock";

const DELAY_MS = 600;

function delay(ms = DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*Gera uma senha temporária simples (letras e números, sem caracteres ambíguos como 0/O ou 1/l)*/
export function gerarSenhaTemporaria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let senha = "";
  const limit = 256 - (256 % chars.length);
  while (senha.length < 12) {
    const value = crypto.getRandomValues(new Uint8Array(1))[0];
    if (value < limit) senha += chars[value % chars.length];
  }
  return senha;
}

/* Serviço MOCKADO de cadastro administrativo de usuários.*/
export const adminService = {
  async cadastrarUsuario(
    data: AdminFormUserData
  ): Promise<CreatedUserResponse> {
    await delay(); // simula latência de rede

    const emailJaExiste = mockUsers.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
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
};