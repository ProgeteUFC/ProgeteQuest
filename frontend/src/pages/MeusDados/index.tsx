import React, { useEffect, useState } from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  PersonalData,
  LogoBottom,
  ExcluirButton,
  SaveButton,
  DadosTitle,
  DadosDescricao,
  Image,
  ModalBackdrop,
  ModalCard,
  ModalIcon,
  ModalActions,
  CancelButton,
  ConfirmDeleteButton,
  ModalError,
} from "./styles";
import Header from "../../components/Header";
import logo from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import { alunoService } from "../../services/alunoService";
import { useNavigate } from "react-router-dom";

export default function MeusDados() {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipo, setTipo] = useState<"student" | "teacher">("student");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [senhaExcluir, setSenhaExcluir] = useState("");
  const [erroExclusao, setErroExclusao] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDados() {
      try {
        const token = localStorage.getItem("token") || "";
        const userId = localStorage.getItem("userId") || "";
        const userType = localStorage.getItem("userType") as "student" | "teacher";
        setTipo(userType || "student");
        const res = await fetch(`http://localhost:3000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNome(data.name || "");
        setEmail(data.email || "");
        if (userType === "student") {
          setMatricula(data.registrationStudent || "");
        } else {
          setMatricula(data.registrationTeacher || "");
        }
      } catch (err) {
        setErro("Erro ao buscar dados.");
      }
    }
    fetchDados();
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    if (senha && senha !== senhaConfirm) {
      setErro("As senhas não coincidem.");
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      const userId = localStorage.getItem("userId") || "";
      const dados: any = {
        name: nome,
        email,
      };
      if (senha) dados.password = senha;
      if (tipo === "student") dados.registrationStudent = matricula;
      else dados.registrationTeacher = matricula;
      await alunoService.atualizarDados(userId, dados, token);
      setSucesso("Dados atualizados com sucesso!");
      setSenha("");
      setSenhaConfirm("");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao atualizar dados. Verifique os campos."
      );
    }
  }

  async function handleExcluirConta() {
    setErroExclusao("");
    if (!senhaExcluir) {
      setErroExclusao("Digite sua senha para confirmar a exclusão.");
      return;
    }
    try {
      setExcluindo(true);
      const token = localStorage.getItem("token") || "";
      await alunoService.excluirConta(token, senhaExcluir);
      localStorage.clear();
      navigate("/");
    } catch (err: any) {
      setErroExclusao(
        err?.response?.data?.message ||
          "Erro ao excluir conta. Verifique a senha e tente novamente."
      );
    } finally {
      setExcluindo(false);
    }
  }

  function handleConfirmarExclusao() {
    setErroExclusao("");
    setMostrarConfirmacao(true);
  }

  function fecharConfirmacao() {
    if (excluindo) return;
    setMostrarConfirmacao(false);
    setSenhaExcluir("");
    setErroExclusao("");
  }

  return (
    <Container>
      <Header />
      <LogoBottom src={logo} alt="Progete logo rodapé" />
      <PageContent>
          <LeftColumn>
            <DadosTitle>Meus Dados</DadosTitle>
            <DadosDescricao>
              Aqui você pode visualizar e editar <br /> seus dados pessoais.
            </DadosDescricao>
            <PersonalData>
              <form onSubmit={handleSalvar}>
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
                  <label>{tipo === "student" ? "Matrícula:" : "SIAPE:"}</label>
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
                  <label>Nova senha:</label>
                  <input
                    type="password"
                    name="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite para alterar"
                  />
                </InputWrapper>
                <InputWrapper>
                  <label>Repita a nova senha:</label>
                  <input
                    type="password"
                    name="senhaConfirm"
                    value={senhaConfirm}
                    onChange={(e) => setSenhaConfirm(e.target.value)}
                    placeholder="Digite para alterar"
                  />
                </InputWrapper>
                <div className="button-group-vertical">
                  <SaveButton type="submit">SALVAR</SaveButton>
                  <ExcluirButton type="button" onClick={handleConfirmarExclusao}>
                    EXCLUIR CONTA
                  </ExcluirButton>
                </div>
                {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
                {sucesso && (
                  <div style={{ color: "green", marginTop: 8 }}>{sucesso}</div>
                )}
              </form>
            </PersonalData>
          </LeftColumn>
      </PageContent>
      <Image src={planetOrange} alt="" />
      {mostrarConfirmacao && (
        <ModalBackdrop onMouseDown={(event) => event.target === event.currentTarget && fecharConfirmacao()}>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="titulo-excluir-conta">
            <ModalIcon aria-hidden="true">!</ModalIcon>
            <h2 id="titulo-excluir-conta">Excluir conta?</h2>
            <p>Essa ação é permanente e todos os seus dados serão removidos.</p>
            <label htmlFor="senha-exclusao">Digite sua senha para confirmar:</label>
            <input
              id="senha-exclusao"
              type="password"
              placeholder="Sua senha"
              value={senhaExcluir}
              onChange={(event) => setSenhaExcluir(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleExcluirConta()}
              autoFocus
            />
            {erroExclusao && <ModalError role="alert">{erroExclusao}</ModalError>}
            <ModalActions>
              <CancelButton type="button" onClick={fecharConfirmacao} disabled={excluindo}>CANCELAR</CancelButton>
              <ConfirmDeleteButton type="button" onClick={handleExcluirConta} disabled={excluindo}>
                {excluindo ? "EXCLUINDO..." : "EXCLUIR CONTA"}
              </ConfirmDeleteButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
    </Container>
  );
}
