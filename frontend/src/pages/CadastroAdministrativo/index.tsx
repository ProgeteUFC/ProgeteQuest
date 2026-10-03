import React, { useState } from "react";
// Reaproveitando os estilos já existentes da RegisterPage
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
  UserTypeRow,
  UserTypeButton,
  Feedback,
} from "../RegisterPage/styles";
import { GerarSenhaButton, PasswordResultBox } from "./styles";
import { TitleName } from "../../components/TitleName";
import {
  adminService,
  gerarSenhaTemporaria,
} from "../../services/adminService";
import {
  AdminFormUserData,
  CreatedUserResponse,
  UserRole,
} from "../../types/user";
import logo from "../../assets/progete.png";
import planet from "../../assets/planet_orange.png";
import artwork from "../../assets/logo.png";

export default function CadastroAdministrativoPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<UserRole>("student");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [usuarioCriado, setUsuarioCriado] =
    useState<CreatedUserResponse | null>(null);

  function montarPayload(): AdminFormUserData {
    if (tipo === "student") {
      return {
        type: "student",
        name: nome,
        email,
        password: senha,
        registrationStudent: matricula,
      };
    }
    if (tipo === "teacher") {
      return {
        type: "teacher",
        name: nome,
        email,
        password: senha,
        registrationTeacher: matricula,
      };
    }
    // administrador não tem matrícula nem SIAPE
    return { type: "admin", name: nome, email, password: senha };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setUsuarioCriado(null);
    setProcessando(true);
    try {
      const payload = montarPayload();
      const usuario = await adminService.cadastrarUsuario(payload);
      setUsuarioCriado(usuario);
      // Limpa o formulário para o próximo cadastro, mas mantém o tipo selecionado (admin provavelmente vai cadastrar vários do mesmo tipo seguidos)
      setNome("");
      setMatricula("");
      setEmail("");
      setSenha("");
    } catch (err: any) {
      setErro(
        err?.message ||
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
              <TitleName titleName="Cadastro administrativo" />
            </div>
            <p className="subtitle">
              Cadastre um novo usuário informando os dados abaixo.
            </p>
          </HeaderContainer>
          <Register>
            <UserTypeRow>
              <UserTypeButton
                type="button"
                $active={tipo === "student"}
                onClick={() => setTipo("student")}
              >
                Aluno(a)
              </UserTypeButton>
              <UserTypeButton
                type="button"
                $active={tipo === "teacher"}
                onClick={() => setTipo("teacher")}
              >
                Professor(a)
              </UserTypeButton>
              <UserTypeButton
                type="button"
                $active={tipo === "admin"}
                onClick={() => setTipo("admin")}
              >
                Administrador(a)
              </UserTypeButton>
            </UserTypeRow>

            <form onSubmit={handleSubmit}>
              <InputWrapper>
                <span>Nome:</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </InputWrapper>

              {/* Aluno usa matrícula, professor usa SIAPE, administrador não tem esse campo */}
              {tipo !== "admin" && (
                <InputWrapper>
                  <span>{tipo === "student" ? "Matrícula:" : "SIAPE:"}</span>
                  <input
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                  />
                </InputWrapper>
              )}

              <InputWrapper>
                <span>E-mail:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                <span>Senha inicial:</span>
                <input
                  type="text"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={8}
                />
              </InputWrapper>

              <GerarSenhaButton
                type="button"
                onClick={() => setSenha(gerarSenhaTemporaria())}
              >
                GERAR SENHA TEMPORÁRIA
              </GerarSenhaButton>

              <CadastrarButton type="submit" disabled={processando}>
                {processando ? "CADASTRANDO..." : "CADASTRAR"}
              </CadastrarButton>

              {erro && <Feedback role="alert">{erro}</Feedback>}

              {usuarioCriado && (
                <PasswordResultBox>
                  <strong>{usuarioCriado.name}</strong> cadastrado(a) com
                  sucesso.
                  <br />
                  Senha inicial: <code>{usuarioCriado.temporaryPassword}</code>
                  <small>
                    Repasse essa senha pessoalmente ao usuário. Por
                    segurança, o sistema não envia senhas por e-mail.
                  </small>
                </PasswordResultBox>
              )}
            </form>
          </Register>
        </LeftColumn>
        <RightArtwork src={artwork} alt="Progete Quest" />
      </PageContent>
    </Container>
  );
}