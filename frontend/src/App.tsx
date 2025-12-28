import React from "react";
import { ThemeProvider, useTheme } from "styled-components";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Button } from "./components/Button";
import image from "./assets/logo.png";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";
import { TitleName } from "./components/TitleName";
import { TitleDescription } from "./components/TitleDescription";
import CadastrarDisciplina from "./pages/CadastrarDisciplina";
import DetalhesDaTurma from "./pages/DetalhesDaTurma";
import SeuRanking from "./pages/SeuRanking";

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <KeyedRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/cadastrarDisciplina"
            element={<CadastrarDisciplina />}
          />
          <Route path="/detalhesDaTurma" element={<DetalhesDaTurma />} />
          <Route path="/seuRanking" element={<SeuRanking />} />
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
