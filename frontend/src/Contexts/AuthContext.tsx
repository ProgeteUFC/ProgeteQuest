
import React, { createContext, useContext } from "react";

export type UserRole = "student" | "teacher" | "admin";

interface AuthContextValue {
  userType: UserRole;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}
