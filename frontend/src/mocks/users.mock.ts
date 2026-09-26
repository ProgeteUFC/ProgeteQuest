import { CreatedUserResponse } from "../types/user";

/* Usuários "já cadastrados", usados só para simular respostas da API */
export const mockUsers: CreatedUserResponse[] = [
  {
    userId: "a1b2c3d4-0000-0000-0000-000000000001",
    name: "Aluno Teste",
    email: "alunoteste@gmail.com",
    type: "student",
    registrationStudent: "202301",
    temporaryPassword: "",
    createdAt: "2026-01-10T12:00:00.000Z",
  },
  {
    userId: "a1b2c3d4-0000-0000-0000-000000000002",
    name: "Professor Teste",
    email: "professorteste@gmail.com",
    type: "teacher",
    registrationTeacher: "SIAPE01",
    temporaryPassword: "",
    createdAt: "2026-01-10T12:00:00.000Z",
  },
];