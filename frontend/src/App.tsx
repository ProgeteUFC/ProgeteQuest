import React from "react";
import { ThemeProvider } from "styled-components";
import { Routes, Route, useLocation } from "react-router-dom";
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
import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUserForm from "./pages/Admin/AdminUserForm";
import AdminTeacherClasses from "./pages/Admin/AdminTeacherClasses";

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <KeyedRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detalhesDaTurma/:id" element={<DetalhesDaTurma />} />
          <Route path="/seuRanking" element={<ProtectedRoute allowedRoles={["student"]}><SeuRanking /></ProtectedRoute>} />
          <Route path="/meusDados" element={<MeusDados />} />
          <Route path="/entrarEmTurma" element={<EntraEmTurma />} />
          <Route path="/minhasTurmas" element={<ProtectedRoute allowedRoles={["student"]}><MinhasTurmas /></ProtectedRoute>} />
          <Route path="/minhasAtividades" element={<ProtectedRoute allowedRoles={["student"]}><MinhasAtividades /></ProtectedRoute>} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:turmaId" element={<ForumTurmaPage />} />
          <Route path="/loginProfessor" element={<LoginProfessor />} />

          {/* Rotas de professor */}
          <Route path="/paginaInicialProfessor" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><PaginaInicialProfessor /></ProtectedRoute>} />
          <Route path="/cadastrarDisciplina" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><CadastrarDisciplina /></ProtectedRoute>} />
          <Route path="/visualizarTurmasProfessor" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><ViewClasses /></ProtectedRoute>} />
          <Route path="/VisualizandoTurmasProfessor/:turmaId" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><VisualizandoTurmasProfessor /></ProtectedRoute>} />
          <Route path="/visualizandoTurmasProfessor/:turmaId" element={<ProtectedRoute allowedRoles={["teacher", "admin"]}><VisualizandoTurmasProfessor /></ProtectedRoute>} />

          {/* Rotas de admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHome /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/users/new" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUserForm /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUserForm /></ProtectedRoute>} />
          <Route path="/admin/teachers/:id/classes" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTeacherClasses /></ProtectedRoute>} />
        </Routes>
      </KeyedRouter>
    </ThemeProvider>
  );
}

const KeyedRouter = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return <div key={location.pathname}>{children}</div>;
};

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>;
