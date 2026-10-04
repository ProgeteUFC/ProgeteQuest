export type UserRole = "student" | "teacher" | "admin";

interface BaseUserData {
  name: string;
  email: string;
  password: string;
}

export interface StudentRegistrationData extends BaseUserData {
  type: "student";
  registrationStudent: string;
  registrationTeacher?: undefined;
}

export interface TeacherRegistrationData extends BaseUserData {
  type: "teacher";
  registrationTeacher: string;
  registrationStudent?: undefined;
}

export interface AdminRegistrationData extends BaseUserData {
  type: "admin";
  registrationStudent?: undefined;
  registrationTeacher?: undefined;
}


export type AdminFormUserData =
  | StudentRegistrationData
  | TeacherRegistrationData
  | AdminRegistrationData;

/*Formato esperado da resposta da API (mockado enquanto o backend não está pronto).*/
export interface CreatedUserResponse {
  userId: string;
  name: string;
  email: string;
  type: UserRole;
  registrationStudent?: string;
  registrationTeacher?: string;
  temporaryPassword: string;
  createdAt: string;
}