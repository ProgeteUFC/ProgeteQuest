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

const UserTypeRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const UserTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  border-radius: 24px;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#2c0383" : "#fff")};
  font-weight: bold;
  font-size: 1.3rem;
  padding: 8px 0;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  box-shadow: ${({ active }) =>
    active ? "0 2px 8px rgba(44, 3, 131, 0.08)" : "none"};
  transition: background 0.2s, color 0.2s;
`;

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
      setSucesso("Cadastro realizado com sucesso! Faça login.");
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
                active={tipo === "student"}
                onClick={() => setTipo("student")}
              >
                Sou aluno(a)
              </UserTypeButton>
              <UserTypeButton
                type="button"
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
