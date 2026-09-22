import React from "react";
import { Navigate } from "react-router-dom";

export type UserRole = "student" | "teacher" | "admin";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

function getHomeForRole(role?: string) {
  switch (role) {
    case "teacher":
    case "admin":
      return "/paginaInicialProfessor";
    case "student":
      return "/minhasTurmas";
    default:
      return "/";
  }
}

// Proteção só de UI/navegação: o backend deve validar o perfil em toda rota sensível,
// já que localStorage pode ser adulterado pelo usuário.
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType")?.toLowerCase() as UserRole | undefined;

  if (!token || !userType) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to={getHomeForRole(userType)} replace />;
  }

  return children;
}
