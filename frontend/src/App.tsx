import React from "react";
import { ThemeProvider } from "styled-components";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";
import CadastrarDisciplina from "./pages/CadastrarDisciplina";
import DetalhesDaTurma from "./pages/DetalhesDaTurma";
import SeuRanking from "./pages/SeuRanking";
import MeusDados from "./pages/MeusDados";
import EntraEmTurma from "./pages/EntrarEmTurma";
import PaginaInicialProfessor from "./pages/PaginaInicialProfessor";
import { MinhasTurmas } from "./pages/MinhasTurmas";
import { MinhasAtividades } from "./pages/MinhasAtividades";
import ForumPage from "./pages/ForumPage";
import LoginProfessor from "./pages/LoginProfessor";

import ForumTurmaPage from "./pages/ForumTurmaPage";
import ViewClasses from './pages/VisualizarTurmasProfessor';
import VisualizandoTurmasProfessor from "./pages/VisualizandoTurmaProfessor";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminSection from "./pages/Admin/AdminSection";
import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUserForm from "./pages/Admin/AdminUserForm";
import AdminTeacherClasses from "./pages/Admin/AdminTeacherClasses";

import CadastroAdministrativoPage from "./pages/CadastroAdministrativo";


export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <KeyedRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detalhesDaTurma/:id" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><DetalhesDaTurma /></ProtectedRoute>} />
          <Route path="/seuRanking" element={<ProtectedRoute allowedRoles={["student"]}><SeuRanking /></ProtectedRoute>} />
          <Route path="/meusDados" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><MeusDados /></ProtectedRoute>} />
          <Route path="/entrarEmTurma" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><EntraEmTurma /></ProtectedRoute>} />
          <Route path="/minhasTurmas" element={<ProtectedRoute allowedRoles={["student"]}><MinhasTurmas /></ProtectedRoute>} />
          <Route path="/minhasAtividades" element={<ProtectedRoute allowedRoles={["student"]}><MinhasAtividades /></ProtectedRoute>} />
          <Route path="/forum" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><ForumPage /></ProtectedRoute>} />
          <Route path="/forum/:turmaId" element={<ProtectedRoute allowedRoles={["student", "teacher", "admin"]}><ForumTurmaPage /></ProtectedRoute>} />
          <Route path="/loginProfessor" element={<LoginProfessor />} />


          {/* Rotas de professor */}
          <Route path="/paginaInicialProfessor" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><PaginaInicialProfessor /></ProtectedRoute>} />
          <Route path="/cadastrarDisciplina" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><CadastrarDisciplina /></ProtectedRoute>} />
          <Route path="/visualizarTurmasProfessor" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><ViewClasses /></ProtectedRoute>} />
          <Route path="/VisualizandoTurmasProfessor/:turmaId" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><VisualizandoTurmasProfessor /></ProtectedRoute>} />
          <Route path="/visualizandoTurmasProfessor/:turmaId" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><VisualizandoTurmasProfessor /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<CadastroAdministrativoPage />} />
            <Route path="users/:id" element={<AdminUserForm />} />
            <Route path="teachers/:id/classes" element={<AdminTeacherClasses />} />
            <Route path="classes" element={<AdminSection title="Turmas" />} />
            <Route path="activities" element={<AdminSection title="Atividades" />} />
            <Route path="forums" element={<AdminSection title="Fóruns" />} />
            <Route path="audit" element={<AdminSection title="Auditoria" />} />
            <Route path="profile" element={<AdminSection title="Meus dados" />} />
          </Route>
          <Route path="/cadastroAdministrativo" element={<Navigate to="/admin/users/new" replace />} />

        </Routes>
      </KeyedRouter>
    </ThemeProvider>
  );
}


const KeyedRouter = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return <div key={location.pathname}>{children}</div>;
};
