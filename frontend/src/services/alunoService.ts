import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const alunoService = {
  async cadastrar(dados: any) {
    return axios.post(`${API_URL}/user`, dados);
  },
async login(email: string, password: string) {
  return axios.post(`${API_URL}/auth/login`, { email, password });
},

async listarTurmas(studentId: string, token: string) {
    return axios.get(`${API_URL}/student-class/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
},
  async entrarEmTurma(studentId: string, joinCode: string, token: string) {
    return axios.post(
      `${API_URL}/student-class/join`,
      { studentId, joinCode },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  async listarAtividades(classId: string, token: string) {
    return axios.get(`${API_URL}/activity/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async ranking(classId: string, token: string) {
    return axios.get(`${API_URL}/student-class/${classId}/ranking`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async atualizarDados(userId: string, dados: any, token: string) {
    return axios.put(`${API_URL}/user`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async excluirConta(token: string, password: string) {
    return axios.post(`${API_URL}/user/delete`, { password }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async buscarTurma(classId: string, token: string) {
    return axios.get(`${API_URL}/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async buscarProfessor(teacherId: string, token: string) {
    return axios.get(`${API_URL}/user/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async listarParticipantesTurma(classId: string, token: string) {
    return axios.get(`${API_URL}/student-class/${classId}/participants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async buscarCodigoAtividade(activityId: string, token: string) {
    // Busca o código ativo da atividade
    return axios.get(`${API_URL}/code/activity/${activityId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async realizarCheckin(dados: { activityId: string; studentId: string; codeId: string }, token: string) {
    return axios.post(`${API_URL}/checkin`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};