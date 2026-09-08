import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../../services/alunoService";
import {
  Container,
  LogoTopLeft,
  Login,
  LoginCard,
  Astronaut,
  AboutUs,
  Feedback,
} from "./style";
import progete from "../../assets/progete.png";
import astronaut from "../../assets/astronaut.png";
import smoke from "../../assets/smoke.png";
import planetOrange from "../../assets/planet_orange.png";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const navigate = useNavigate();

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setErro("");
  setProcessando(true);
  try {
    const res = await alunoService.login(email, senha);
    
    // Armazena os dados
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.userId);
    localStorage.setItem("userType", res.data.user.type);

    //Lógica de Redirecionamento Dinâmico
    const userType = String(res.data.user.type).toLowerCase();

    if (userType === "teacher") {
      navigate("/paginaInicialProfessor"); // Rota para professores
    } else {
      navigate("/minhasTurmas"); // Rota padrão dos alunos
    }

  } catch (err: any) {
    setErro(
      err?.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais."
    );
  } finally {
    setProcessando(false);
  }
}

  return (
    <Container>
      <LogoTopLeft>
        <img src={progete} alt="progete" />
      </LogoTopLeft>
      <Login>
        <LoginCard>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha:"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <a className="forgot" href="#" onClick={(event) => event.preventDefault()}>
              Esqueci minha senha
            </a>
            <div className="actions-row">
                <button type="submit" className="login-btn" disabled={processando}>
                  {processando ? "ENTRANDO..." : "LOGIN"}
                </button>
                <button
                  type="button"
                  className="register-btn"
                  onClick={() => navigate("/register")}
                >
                  CRIAR CONTA
                </button>
            </div>
            {erro && <Feedback role="alert">{erro}</Feedback>}
          </form>
        </LoginCard>
      </Login>

      <AboutUs>
        <div className="welcome-area">
          <img src={planetOrange} alt="Planeta" className="planet" />
          <h2 className="bemvindo">Bem-Vindo(a) ao</h2>
          <img src={logo} alt="ProgeteQuest" className="logo-progetequest" />
          <h2 className="desafie">Desafie, Supere e Vença!</h2>
          <div className="descricao">
            <b>
              ProgeteQuest é o sistema de gamificação acadêmica <br />
              desenvolvido por alunos da UFC Campus de Russas! <br />
              {/* <br /> */}
              Aqui, os professores lançam desafios e os alunos <br /> conquistam
              pontos extras nas disciplinas. <br />
              {/* <br /> */}
              Aprender nunca foi tão divertido!
            </b>
          </div>
          <div className="copyright">
            Copyright © 2025, ProgeteQuest! All Rights Reserved.
          </div>
        </div>
      </AboutUs>
      <Astronaut>
        <img src={astronaut} alt="Astronauta" />
        <img src={smoke} alt="Fumaça" className="smoke" />
      </Astronaut>
    </Container>
  );
}
