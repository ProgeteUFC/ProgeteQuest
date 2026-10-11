import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export type UserRole = "student" | "teacher" | "admin";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

function getHomeForRole(role?: string) {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
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
  const [userType, setUserType] = useState<UserRole>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    setError("");
    axios.get(`${import.meta.env.VITE_API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (!active) return;
        setUserType(data.type);
        localStorage.setItem("userType", data.type);
      })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 401 || err.response?.status === 403) {
          ["token", "userId", "userType"].forEach((key) => localStorage.removeItem(key));
          setError("Sua sessão expirou ou sua conta está inativa. Entre novamente.");
        } else setError("Não foi possível verificar sua sessão. Tente novamente.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, revision]);

  if (error) return <div role="alert"><p>{error}</p>{token && <button onClick={() => setRevision((value) => value + 1)}>Tentar novamente</button>} <Link to="/">Entrar</Link></div>;
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (loading) return <p role="status">Verificando sessão...</p>;
  if (!userType) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(userType)) {
    return <Navigate to={getHomeForRole(userType)} replace />;
  }

  return children;
}
