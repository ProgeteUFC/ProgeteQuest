
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import styled from "styled-components";

import { TitleName } from "../../../components/TitleName";
import { adminMenu } from "../../../components/HeaderAdmin/menu";
import {
  adminService,
  type AdminDashboard,
} from "../../../services/adminService";

import {
  MenuContainer,
  MenuOptions,
  MenuOption,
  CreateUserLink,
  DashboardGrid,
  DashboardCard,
  RecentUsersSection,
  RecentUsersList,
  RecentUserItem,
  DashboardFeedback,
} from "./styles";

const Content = styled.section`
  padding: 32px 16px;
  max-width: 1100px;
  margin: auto;
  text-align: center;

  & h1 {
    font-size: clamp(24px, 4vw, 36px);
    line-height: 1.3;
  }
`;

export default function AdminHome() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      try {
        const dados = await adminService.buscarDashboard();

        if (ativo) {
          setDashboard(dados);
        }
      } catch (err) {
        if (ativo) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar o dashboard."
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);

  const indicadores = dashboard
    ? [
        {
          titulo: "Alunos ativos",
          valor: dashboard.students.active,
        },
        {
          titulo: "Alunos inativos",
          valor: dashboard.students.inactive,
        },
        {
          titulo: "Professores ativos",
          valor: dashboard.teachers.active,
        },
        {
          titulo: "Professores inativos",
          valor: dashboard.teachers.inactive,
        },
        {
          titulo: "Total de turmas",
          valor: dashboard.totalClasses,
        },
      ]
    : [];

  return (
    <Content>
      <TitleName titleName="Olá, Administrador(a)! O que você deseja fazer?" />

      <MenuContainer>
        <MenuOptions>
          {adminMenu.slice(1).map((item) => (
            <MenuOption as={Link} to={item.to} key={item.to}>
              {item.label}
            </MenuOption>
          ))}
        </MenuOptions>
      </MenuContainer>

      <p>Gerencie os usuários e recursos do ProgeteQuest.</p>

      <CreateUserLink as={Link} to="/admin/users/new">
        <FiUserPlus size={20} aria-hidden="true" />
        <span>Cadastrar novo usuário</span>
      </CreateUserLink>

      {loading && (
        <DashboardFeedback role="status">
          Carregando informações do dashboard...
        </DashboardFeedback>
      )}

      {error && (
        <DashboardFeedback role="alert">
          Erro ao carregar o dashboard: {error}
        </DashboardFeedback>
      )}

      {dashboard && (
        <>
          <DashboardGrid>
            {indicadores.map((indicador) => (
              <DashboardCard key={indicador.titulo}>
                <h2>{indicador.titulo}</h2>
                <strong>{indicador.valor}</strong>
              </DashboardCard>
            ))}
          </DashboardGrid>

          <RecentUsersSection>
            <h2>Usuários desativados recentemente</h2>

            {dashboard.recentlyDisabledUsers.length === 0 ? (
              <p>Nenhum usuário desativado recentemente.</p>
            ) : (
              <RecentUsersList>
                {dashboard.recentlyDisabledUsers.map((usuario) => (
                  <RecentUserItem key={usuario.userId}>
                    <div>
                      <strong>{usuario.name}</strong>
                      <span>{usuario.email}</span>
                    </div>

                    <div>
                      <span>
                        {usuario.type === "student"
                          ? "Aluno"
                          : usuario.type === "teacher"
                            ? "Professor"
                            : "Administrador"}
                      </span>

                      <span>
                        {usuario.deactivatedAt
                          ? new Date(
                              usuario.deactivatedAt
                            ).toLocaleString("pt-BR")
                          : "Data não informada"}
                      </span>
                    </div>
                  </RecentUserItem>
                ))}
              </RecentUsersList>
            )}
          </RecentUsersSection>
        </>
      )}
    </Content>
  );
}
