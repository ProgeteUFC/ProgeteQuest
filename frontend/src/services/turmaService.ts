import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface TurmaProfessor {
  classId: string;
  teacherId: string;
  name: string;
  joinCode: string | null;
}

export interface ParticipanteTurma {
  studentId: string;
  registrationStudent: string;
  name: string;
  email: string;
  checkins?: number;
}

export interface AvaliacaoTurma {
  assessmentId: string;
  name: string;
  classId: string;
}

export interface AtividadeTurma {
  activityId: string;
  name: string;
  date: string;
  type: "activity" | "seminar" | "attendance";
  classId: string;
  assessmentId: string | null;
}

export interface EntregaAtividade {
  checkinId: string;
  studentId: string;
  name: string;
  registrationStudent: string;
  deliveredAt: string;
}

export interface CodigoAtividade {
  codeId: string;
  code: string;
  validity: string;
  active: boolean;
  score: number;
  activityId: string;
}

const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const turmaService = {
  async listarTurmasProfessor(token: string) {
    return axios.get<TurmaProfessor[]>(`${API_URL}/class`, auth(token));
  },
  async buscarTurma(classId: string, token: string) {
    return axios.get<TurmaProfessor>(`${API_URL}/class/${classId}`, auth(token));
  },
  async buscarRanking(classId: string, token: string) {
    return axios.get<ParticipanteTurma[]>(`${API_URL}/student-class/${classId}/ranking`, auth(token));
  },
  async listarParticipantes(classId: string, token: string) {
    return axios.get<ParticipanteTurma[]>(`${API_URL}/student-class/${classId}/participants`, auth(token));
  },
  async matricularAluno(registrationStudent: string, joinCode: string, token: string) {
    return axios.post(`${API_URL}/student-class/enroll`, { registrationStudent, joinCode }, auth(token));
  },
  async regenerarJoinCode(classId: string, token: string) {
    return axios.patch<TurmaProfessor>(`${API_URL}/class/${classId}/join-code`, {}, auth(token));
  },
  async excluirTurma(classId: string, token: string) {
    return axios.delete(`${API_URL}/class/${classId}`, auth(token));
  },
  async criarAvaliacao(name: string, classId: string, token: string) {
    return axios.post<AvaliacaoTurma>(`${API_URL}/assessment`, { name, classId }, auth(token));
  },
  async listarAvaliacoes(classId: string, token: string) {
    const response = await axios.get<AvaliacaoTurma[]>(`${API_URL}/assessment`, auth(token));
    return response.data.filter((assessment) => assessment.classId === classId);
  },
  async criarAtividade(dados: Omit<AtividadeTurma, "activityId" | "assessmentId">, token: string) {
    return axios.post<AtividadeTurma>(`${API_URL}/activity`, dados, auth(token));
  },
  async listarAtividades(classId: string, token: string) {
    return axios.get<AtividadeTurma[]>(`${API_URL}/activity/class/${classId}`, auth(token));
  },
  async editarAtividade(
    activityId: string,
    dados: Pick<AtividadeTurma, "name" | "date" | "type">,
    token: string
  ) {
    return axios.put<AtividadeTurma>(`${API_URL}/activity/${activityId}`, dados, auth(token));
  },
  async excluirAtividade(activityId: string, token: string) {
    return axios.delete<AtividadeTurma[]>(`${API_URL}/activity/${activityId}`, auth(token));
  },
  async listarEntregas(activityId: string, token: string) {
    return axios.get<EntregaAtividade[]>(`${API_URL}/checkin/activity/${activityId}`, auth(token));
  },
  async listarCodigosAtividade(activityId: string, token: string) {
    return axios.get<CodigoAtividade[]>(`${API_URL}/code/activity/${activityId}`, auth(token));
  },
  async criarCodigoAtividade(activityId: string, validity: string, token: string) {
    return axios.post<CodigoAtividade>(`${API_URL}/code`, {
      activityId,
      validity,
      score: 10,
      code: "",
      active: true,
    }, auth(token));
  },
  async renovarCodigoAtividade(codeId: string, token: string) {
    return axios.patch<CodigoAtividade>(`${API_URL}/code/${codeId}/renew`, {}, auth(token));
  },
};
