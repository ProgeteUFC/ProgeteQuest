import React, { useState } from "react";
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
import { MinhasTurmas } from "./pages/MinhasTurmas";
import { MinhasAtividades } from "./pages/MinhasAtividades";
import ForumPage from "./pages/ForumPage";
import ForumTurmaPage from "./pages/ForumTurmaPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <KeyedRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detalhesDaTurma/:id" element={<DetalhesDaTurma />} />
          <Route path="/seuRanking" element={<SeuRanking />} />
          <Route path="/meusDados" element={<MeusDados />} />
          <Route path="/entrarEmTurma" element={<EntraEmTurma />} />
          <Route path="/minhasTurmas" element={<MinhasTurmas />} />
          <Route path="/minhasAtividades" element={<MinhasAtividades />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:turmaId" element={<ForumTurmaPage />} />
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
