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

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <KeyedRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detalhesDaTurma/:id" element={<DetalhesDaTurma />} />
          <Route path="/seuRanking" element={<PrivateRouteAluno><SeuRanking /></PrivateRouteAluno>} />
          <Route path="/meusDados" element={<MeusDados />} />
          <Route path="/entrarEmTurma" element={<EntraEmTurma />} />
          <Route path="/minhasTurmas" element={<PrivateRouteAluno><MinhasTurmas /></PrivateRouteAluno>} />
          <Route path="/minhasAtividades" element={<PrivateRouteAluno><MinhasAtividades /></PrivateRouteAluno>} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:turmaId" element={<ForumTurmaPage />} />
          <Route path="/paginaInicialProfessor" element={<PaginaInicialProfessor />} />
          <Route path="/cadastrarDisciplina" element={<CadastrarDisciplina />} />
          <Route path="/visualizarTurmasProfessor" element={<ViewClasses />} />
          <Route path="/VisualizandoTurmasProfessor/:turmaId" element={<VisualizandoTurmasProfessor />} />
          <Route path="/visualizandoTurmasProfessor/:turmaId" element={<VisualizandoTurmasProfessor />} />
          <Route path="/loginProfessor" element={<LoginProfessor />} />
        </Routes>
      </KeyedRouter>
    </ThemeProvider>
  );
}

function PrivateRouteAluno({ children }: { children: React.ReactElement }) {
  const userType = localStorage.getItem("userType")?.toLowerCase();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;
  if (userType === "teacher" || userType === "admin") {
    return <Navigate to="/paginaInicialProfessor" replace />;
  }
  if (userType !== "student") return <Navigate to="/" replace />;

  return children;
}

const KeyedRouter = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return <div key={location.pathname}>{children}</div>;
};

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>;
