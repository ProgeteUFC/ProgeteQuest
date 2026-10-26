
import React, { useEffect, useState } from "react";
import { generatePath, Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext, type UserRole } from "../../Contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
  adminRedirect?: string;
}

function getHomeForRole(role: UserRole) {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/paginaInicialProfessor";
    case "student":
      return "/minhasTurmas";
  }
}

function isUserRole(value: unknown): value is UserRole {
  return value === "student" || value === "teacher" || value === "admin";
}

export default function ProtectedRoute({
  allowedRoles,
  children,
  adminRedirect,
}: ProtectedRouteProps) {
  const params = useParams();
  const token = localStorage.getItem("token");

  const [userType, setUserType] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setUserType(null);
      return;
    }

    let active = true;

    setLoading(true);
    setError("");
    setUserType(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (!active) return;

        if (!isUserRole(data.type)) {
          setError("Perfil de usuário inválido.");
          return;
        }

        setUserType(data.type);
        localStorage.setItem("userType", data.type);
      })
      .catch((err) => {
        if (!active) return;

        const status = err.response?.status;

        // /user/me é permitido a todos os perfis ativos. Neste endpoint,
        // 403 também indica sessão inválida ou conta inativa no guard atual.
        if (status === 401 || status === 403) {
          ["token", "userId", "userType"].forEach((key) =>
            localStorage.removeItem(key)
          );
        } else {
          setError(
            "Não foi possível verificar sua sessão. Tente novamente."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, revision]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p role="status">Verificando sessão...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <h2>Não foi possível acessar a página</h2>
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setRevision((value) => value + 1)}
        >
          Tentar novamente
        </button>
        <Link to="/">Ir para o login</Link>
      </div>
    );
  }

  if (!userType) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return (
      <div role="alert">
        <h2>Acesso negado</h2>
        <p>Você não possui permissão para acessar esta página.</p>
        <Link to={getHomeForRole(userType)}>
          Voltar para minha página inicial
        </Link>
      </div>
    );
  }

  if (userType === "admin" && adminRedirect) {
    return <Navigate to={generatePath(adminRedirect, params)} replace />;
  }

  return (
    <AuthContext.Provider value={{ userType }}>
      {children}
    </AuthContext.Provider>
  );
}
