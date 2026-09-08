import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LoginButton,
  UserTypeRow,
  UserTypeButton,
  Feedback,
} from "./styles";
import { TitleName } from "../../components/TitleName";
import { alunoService } from "../../services/alunoService";
import logo from "../../assets/progete.png";
import planet from "../../assets/planet_orange.png";
import artwork from "../../assets/logo.png";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipo, setTipo] = useState<"student" | "teacher">("student");
  const [processando, setProcessando] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (senha !== senhaConfirm) {
      setErro("As senhas não coincidem.");
      return;
    }
    setProcessando(true);
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
      navigate(
        String(res.data.user.type).toLowerCase() === "teacher"
          ? "/paginaInicialProfessor"
          : "/minhasTurmas",
        { replace: true }
      );
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao cadastrar. Verifique os dados e tente novamente."
      );
    } finally {
      setProcessando(false);
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
                $active={tipo === "student"}
                onClick={() => setTipo("student")}
              >
                Sou aluno(a)
              </UserTypeButton>
              <UserTypeButton
                type="button"
                className={tipo === "teacher" ? "active" : ""}
                $active={tipo === "teacher"}
                onClick={() => setTipo("teacher")}
              >
                Sou professor(a)
              </UserTypeButton>
            </UserTypeRow>
            <form onSubmit={handleRegister}>
              <InputWrapper>
                <span>Nome:</span>
                <input
                  type="text"
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <span>{tipo === "student" ? "Matrícula:" : "SIAPE:"}</span>
                <input
                  type="text"
                  name="matricula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <span>E-mail:</span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <span>Senha:</span>
                <input
                  type="password"
                  name="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <span>Repita sua senha:</span>
                <input
                  type="password"
                  name="senhaConfirm"
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  required
                />
              </InputWrapper>
              <div className="button-group-vertical">
                <LoginButton type="button" onClick={() => navigate("/")}>
                  FAZER LOGIN
                </LoginButton>
                <CadastrarButton type="submit" disabled={processando}>
                  {processando ? "CADASTRANDO..." : "CADASTRAR"}
                </CadastrarButton>
              </div>
              {erro && <Feedback role="alert">{erro}</Feedback>}
              {sucesso && <Feedback $success>{sucesso}</Feedback>}
            </form>
          </Register>
        </LeftColumn>
        <RightArtwork src={artwork} alt="Progete Quest" />
      </PageContent>
    </Container>
  );
}
