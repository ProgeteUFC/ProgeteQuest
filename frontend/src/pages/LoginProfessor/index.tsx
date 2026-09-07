import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../../services/alunoService";
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

const LoginProfessor = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErro("");
    try {
      const res = await alunoService.login(email, senha);
      const userType = res.data.user.type;

      if (userType !== "teacher") {
        setErro("Esta tela é apenas para professores.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.userId);
      localStorage.setItem("userType", userType);
      navigate("/paginaInicialProfessor");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais."
      );
    }
  };

  const handleCriarConta = () => {
    navigate("/register");
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
        {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
      </Card>

      <Descricao>
        ProgeteQuest é o sistema de gamificação acadêmica desenvolvido por
        alunos da UFC Campus de Russas! Aqui, os professores lançam desafios e
        os alunos conquistam pontos extras nas disciplinas. Aprender nunca foi
        tão divertido!
      </Descricao>

      <Astronauta src={astronauta} alt="" aria-hidden="true" />

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

export default LoginProfessor;
