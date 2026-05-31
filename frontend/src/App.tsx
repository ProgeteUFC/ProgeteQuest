import React, { useState } from "react";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "styled-components";
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

import ForumTurmaPage from "./pages/ForumTurmaPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import ViewClasses from './pages/VisualizarTurmasProfessor';
import VisualizandoTurmasProfessor from "./pages/VisualizandoTurmaProfessor";

export default function App() {
  const [count, setCount] = useState(0);
  const userType = localStorage.getItem("userType");


  // Rotas protegidas para aluno
  function PrivateRouteAluno({ children }: { children: React.ReactElement }) {
    const [negado, setNegado] = useState(false);
    useEffect(() => {
      if (userType !== "student") {
        setNegado(true);
        setTimeout(() => {
          window.location.href = "/paginaInicialProfessor";
        }, 2000);
      }
    }, []);
    if (userType !== "student") {
      return <div style={{color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: 40}}>Acesso negado: apenas alunos podem acessar esta página.</div>;
    }
    return children;
  }

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
          <Route path="/visualizarTurmasProfessor" element={<ViewClasses />} />
          <Route path="/VisualizandoTurmasProfessor/:turmaId" element={<VisualizandoTurmasProfessor />} />
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
