import React, { useState } from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  Register,
  LogoTop,
  LogoBottom,
  Planet,
  RightArtwork,
  HeaderContainer,
  CadastrarButton,
} from "./styles";
import { TitleName } from "../../components/TitleName";
import { alunoService } from "../../services/alunoService";
import logo from "../../assets/progete.png";
import planet from "../../assets/planet_orange.png";
import artwork from "../../assets/logo.png";
import styled from "styled-components";
import { UserTypeRow, UserTypeButton } from "./styles";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipo, setTipo] = useState<"student" | "teacher">("student");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (senha !== senhaConfirm) {
      setErro("As senhas não coincidem.");
      return;
    }
    try {
      await alunoService.cadastrar({
        name: nome,
        email,
        password: senha,
        type: tipo,
        registrationStudent: tipo === "student" ? matricula : undefined,
        registrationTeacher: tipo === "teacher" ? matricula : undefined,
      });
      // Realiza login automático após cadastro
      const res = await alunoService.login(email, senha);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.userId);
      localStorage.setItem("userType", res.data.user.type);
      setSucesso("Cadastro realizado com sucesso! Você foi logado.");
      // Redireciona para Minhas Turmas
      window.location.href =
        res.data.user.type === "teacher"
          ? "/paginaInicialProfessor"
          : "/minhasTurmas";
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao cadastrar. Verifique os dados e tente novamente."
      );
    }
  }

  return (
    <Container>
      <LogoTop src={logo} alt="Progete logo topo" />
      <LogoBottom src={logo} alt="Progete logo rodapé" />
      <Planet src={planet} alt="planet" />
      <PageContent>
        <LeftColumn>
          <HeaderContainer>
            <div className="title-wrapper">
              <TitleName titleName="Cadastro" />
            </div>
            <p className="subtitle">
              Novo usuário? Insira seus dados abaixo e confirme seu cadastro.
            </p>
          </HeaderContainer>
          <Register>
            <UserTypeRow>
              <UserTypeButton
                type="button"
                className={tipo === "student" ? "active" : ""}
                active={tipo === "student"}
                onClick={() => setTipo("student")}
              >
                Sou aluno(a)
              </UserTypeButton>
              <UserTypeButton
                type="button"
                className={tipo === "teacher" ? "active" : ""}
                active={tipo === "teacher"}
                onClick={() => setTipo("teacher")}
              >
                Sou professor(a)
              </UserTypeButton>
            </UserTypeRow>
            <form onSubmit={handleRegister}>
              <InputWrapper>
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <label>{tipo === "student" ? "Matrícula:" : "Registro:"}</label>
                <input
                  type="text"
                  name="matricula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <label>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <label>Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <label>Repita sua senha:</label>
                <input
                  type="password"
                  name="senhaConfirm"
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  required
                />
              </InputWrapper>
              <div className="button-group-vertical">
                <CadastrarButton type="submit">CADASTRAR</CadastrarButton>
              </div>
              {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
              {sucesso && (
                <div style={{ color: "green", marginTop: 8 }}>{sucesso}</div>
              )}
            </form>
          </Register>
        </LeftColumn>
        <RightArtwork src={artwork} alt="Progete Quest" />
      </PageContent>
    </Container>
  );
}
