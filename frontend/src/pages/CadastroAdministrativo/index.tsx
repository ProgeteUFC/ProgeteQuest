import React, { useState } from "react";
// Reaproveitando os estilos já existentes da RegisterPage
import {
  LeftColumn,
  PageContent,
  InputWrapper,
  Register,
  LogoTop,
  Planet,
  RightArtwork,
  HeaderContainer,
  CadastrarButton,
  Feedback,
} from "../RegisterPage/styles";
import { Container, GerarSenhaButton, PasswordResultBox, UserTypeRow, UserTypeButton } from "./styles";
import { TitleName } from "../../components/TitleName";
import {
  adminService,
  gerarSenhaTemporaria,
  mensagemDeErro,
} from "../../services/adminService";
import { AdminFormUserData, UserRole } from "../../types/user";
import logo from "../../assets/progete.png";
import planet from "../../assets/planet_orange.png";
import artwork from "../../assets/logo.png";

// Mesmas regras que o backend aplica ao cadastrar usuários
const EMAIL_REGEX = /^.+@.+\.com$/;
const IDENTIFICACAO_REGEX = /^\d{6}$/; // matrícula e SIAPE: 6 dígitos
const SENHA_MIN = 8;

interface UsuarioCadastrado {
  nome: string;
  senha: string;
}

export default function CadastroAdministrativoPage() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<UserRole>("student");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [cadastrado, setCadastrado] = useState<UsuarioCadastrado | null>(null);

  const rotuloIdentificacao = tipo === "student" ? "Matrícula" : "SIAPE";

  function montarPayload(): AdminFormUserData {
    const base = {
      name: nome.trim(),
      email: email.trim().toLowerCase(),
      password: senha,
    };
    if (tipo === "student") {
      return { ...base, type: "student", registrationStudent: matricula };
    }
    if (tipo === "teacher") {
      return { ...base, type: "teacher", registrationTeacher: matricula };
    }
    // administrador não tem matrícula nem SIAPE
    return { ...base, type: "admin" };
  }

  function validar(): string | null {
    if (!EMAIL_REGEX.test(email.trim())) {
      return "O e-mail deve estar no formato exemplo@exemplo.com";
    }
    if (tipo !== "admin" && !IDENTIFICACAO_REGEX.test(matricula)) {
      return `${rotuloIdentificacao} deve conter exatamente 6 dígitos numéricos.`;
    }
    if (senha.length < SENHA_MIN) {
      return `A senha deve ter no mínimo ${SENHA_MIN} caracteres.`;
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCadastrado(null);

    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Sessão não encontrada. Faça login novamente.");
      return;
    }

    setProcessando(true);
    try {
      const payload = montarPayload();
      await adminService.cadastrarUsuario(payload, token);
      // A senha exibida vem do que foi enviado, não da resposta da API
      // (o backend não devolve senha).
      setCadastrado({ nome: payload.name, senha: payload.password });
      // Limpa o formulário para o próximo cadastro, mas mantém o tipo selecionado
      setNome("");
      setMatricula("");
      setEmail("");
      setSenha("");
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setProcessando(false);
    }
  }

  return (
    <Container>
      <LogoTop src={logo} alt="Progete logo topo" />
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
                  maxLength={50}
                  required
                />
              </InputWrapper>

              {/* Aluno usa matrícula, professor usa SIAPE, administrador não tem esse campo */}
              {tipo !== "admin" && (
                <InputWrapper>
                  <span>{rotuloIdentificacao}:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={matricula}
                    onChange={(e) =>
                      setMatricula(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={6}
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
                  maxLength={100}
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
                  minLength={SENHA_MIN}
                />
              </InputWrapper>

              <GerarSenhaButton
                type="button"
                onClick={() => setSenha(gerarSenhaTemporaria())}
              >
                GERAR SENHA INICIAL
              </GerarSenhaButton>

              <CadastrarButton type="submit" disabled={processando}>
                {processando ? "CADASTRANDO..." : "CADASTRAR"}
              </CadastrarButton>

              {erro && <Feedback role="alert">{erro}</Feedback>}

              {cadastrado && (
                <PasswordResultBox>
                  <strong>{cadastrado.nome}</strong> cadastrado(a) com sucesso.
                  <br />
                  Senha inicial: <code>{cadastrado.senha}</code>
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