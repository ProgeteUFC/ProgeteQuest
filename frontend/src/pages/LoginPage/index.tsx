import React, { useState } from "react";
import {
  Container,
  Login,
  LoginCard,
  AboutUs,
  LogoTopLeft,
  Astronaut,
  SmokeRight,
} from "./style";
import progete from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import logo from "../../assets/logo.png";
import astronaut from "../../assets/astronaut.png";
import smoke from "../../assets/smoke.png";

export default function LoginPage() {
  const [userType, setUserType] = useState<"student" | "teacher">("student");

  return (
    <Container>
      <LogoTopLeft>
        <img src={progete} alt="progete" />
      </LogoTopLeft>
      <Login>
        <LoginCard>
          <div className="user-type-row">
            <button
              type="button"
              className={userType === "student" ? "active" : ""}
              onClick={() => setUserType("student")}
            >
              Sou aluno(a)
            </button>
            <button
              type="button"
              className={userType === "teacher" ? "active" : ""}
              onClick={() => setUserType("teacher")}
            >
              Sou professor(a)
            </button>
          </div>
          <input type="email" placeholder="E-mail:" />
          <input type="password" placeholder="Senha:" />
          <a className="forgot" href="#">
            Esqueci minha senha
          </a>
          <div className="actions-row">
            <button className="login-btn" type="submit">
              LOGIN
            </button>
            <button
              className="register-btn"
              type="button"
              onClick={() => (window.location.href = "/register")}
            >
              CRIAR CONTA
            </button>
          </div>
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
      <SmokeRight src={smoke} alt="Fumaça direita" />
    </Container>
  );
}
