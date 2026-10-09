import axios from "axios";
import { AdminFormUserData, CreatedUserResponse } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL;
const CREATE_USER_PATH = "/admin/users";

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

/* Converte erros do axios em mensagens para mostrar no formulário. */
export function mensagemDeErro(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.";
    }

    const { status, data } = err.response;
    // O ValidationPipe do Nest devolve "message" como lista de textos
    const detalhe: string | undefined = Array.isArray(data?.message)
      ? data.message.join(" ")
      : data?.message;

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

/* Serviço de cadastro administrativo de usuários (API real). */
export const adminService = {
  async cadastrarUsuario(
    data: AdminFormUserData,
    token: string
  ): Promise<CreatedUserResponse> {
    const response = await axios.post<CreatedUserResponse>(
      `${API_URL}${CREATE_USER_PATH}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};