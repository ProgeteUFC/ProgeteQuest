import React, { useState } from "react";
import {
  Container,
  Planeta,
  Header,
  BemVindo,
  Logo,
  Tagline,
  Card,
  CardTitle,
  InputField,
  EsqueciSenha,
  Actions,
  BtnLogin,
  BtnCriarConta,
  Descricao,
  AstronautaWrapper,
  Smoke,
  Astronauta,
  Footer,
  FooterBrand,
  FooterLogo,
  FooterNome,
  FooterCopy,
} from "./styles";

import planeta from "../../assets/planet_orange.png";
import logoProgeteQuest from "../../assets/logo.png";
import astronauta from "../../assets/astronaut.png";
import logoProgete from "../../assets/progete.png";
import smoke from "../../assets/smoke.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    console.log("Login professor:", { email, senha });
  };

  const handleCriarConta = () => {
    console.log("Criar conta professor");
  };

  const handleEsqueciSenha = () => {
    console.log("Esqueci minha senha");
  };

  return (
    <Container>
      <Planeta src={planeta} alt="" aria-hidden="true" />

      <Header>
        <BemVindo>Bem-Vindo(a) ao</BemVindo>
        <Logo src={logoProgeteQuest} alt="ProgeteQuest" />
        <Tagline>Desafie, Supere e Vença!</Tagline>
      </Header>

      <Card>
        <CardTitle>ACESSAR CONTA</CardTitle>

        <InputField
          type="email"
          placeholder="E-mail:"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <InputField
          type="password"
          placeholder="Senha:"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
        />

        <EsqueciSenha type="button" onClick={handleEsqueciSenha}>
          Esqueci minha senha
        </EsqueciSenha>

        <Actions>
          <BtnLogin type="button" onClick={handleLogin}>
            LOGIN
          </BtnLogin>
          <BtnCriarConta type="button" onClick={handleCriarConta}>
            CRIAR CONTA
          </BtnCriarConta>
        </Actions>
      </Card>

      <Descricao>
        ProgeteQuest é o sistema de gamificação acadêmica desenvolvido por
        alunos da UFC Campus de Russas! Aqui, os professores lançam desafios e
        os alunos conquistam pontos extras nas disciplinas. Aprender nunca foi
        tão divertido!
      </Descricao>

      <AstronautaWrapper>
      <Smoke src={smoke} alt="" aria-hidden="true" className="smoke-left" />
      <Astronauta src={astronauta} alt="" aria-hidden="true" />
      <Smoke src={smoke} alt="" aria-hidden="true" className="smoke-right" />
      </AstronautaWrapper>

      <Footer>
        <FooterBrand>
          <FooterLogo src={logoProgete} alt="Progete!" />
          <FooterNome></FooterNome>
        </FooterBrand>
        <FooterCopy>
          Copyright © 2025, ProgeteQuest® All Rights Reserved.
        </FooterCopy>
      </Footer>
    </Container>
  );
};

export default LoginPage;