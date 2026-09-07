import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export interface ForumApi { forumId: string; turmaId: string }
export interface TopicApi {
  topicId: string;
  forumId: string;
  titulo: string;
  descricao?: string;
  status: "OPEN" | "CLOSED";
  criadoEm: string;
  autor: { userId: string; name: string; email: string };
  postsCount: number;
}
export interface PostApi {
  postId: string;
  topicId: string;
  mensagem: string;
  criadoEm: string;
  autor: { userId: string; name: string; email: string };
}

export const forumService = {
  buscarPorTurma(turmaId: string, token: string) {
    return axios.get<ForumApi>(`${API_URL}/turmas/${turmaId}/forum`, auth(token));
  },
  habilitar(turmaId: string, token: string) {
    return axios.post<ForumApi>(`${API_URL}/turmas/${turmaId}/forum`, {}, auth(token));
  },
  listarTopicos(forumId: string, token: string) {
    return axios.get<{ data: TopicApi[] }>(`${API_URL}/forum/${forumId}/topics`, auth(token));
  },
  criarTopico(forumId: string, titulo: string, descricao: string, token: string) {
    return axios.post<TopicApi>(`${API_URL}/forum/${forumId}/topic`, { titulo, descricao }, auth(token));
  },
  fecharTopico(topicId: string, token: string) {
    return axios.patch<TopicApi>(`${API_URL}/topic/${topicId}/close`, {}, auth(token));
  },
  listarPostagens(topicId: string, token: string) {
    return axios.get<{ data: PostApi[] }>(`${API_URL}/topic/${topicId}/posts`, auth(token));
  },
  responderTopico(topicId: string, mensagem: string, token: string) {
    return axios.post<PostApi>(`${API_URL}/topic/${topicId}/post`, { mensagem }, auth(token));
  },
};
