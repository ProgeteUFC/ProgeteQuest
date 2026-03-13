import React, { useEffect, useState } from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  PersonalData,
  LogoBottom,
  HeaderContainer,
  SaveButton,
  DadosTitle,
  DadosDescricao,
  Image,
} from "./styles";
import Header from "../../components/Header";
import logo from "../../assets/progete.png";
import planet_blue from "../../assets/planet_blue_anel.png";
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
    setErro("");
    if (!senhaExcluir) {
      setErro("Digite sua senha para confirmar a exclusão.");
      return;
    }
    try {
      const token = localStorage.getItem("token") || "";
      await alunoService.excluirConta(token, senhaExcluir);
      localStorage.clear();
      navigate("/");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao excluir conta. Verifique a senha e tente novamente."
      );
    }
  }

  function handleConfirmarExclusao() {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Essa ação é permanente e não pode ser desfeita."
      )
    ) {
      setMostrarConfirmacao(true);
    }
  }

  return (
    <>
      <Header />
      <Container>
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
                  <label>{tipo === "student" ? "Matrícula:" : "Siape/Registro:"}</label>
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
                  {!mostrarConfirmacao ? (
                    <button
                      type="button"
                      style={{
                        marginTop: 12,
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: 24,
                        padding: "10px 24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        maxWidth: 260,
                      }}
                      onClick={handleConfirmarExclusao}
                    >
                      EXCLUIR CONTA
                    </button>
                  ) : (
                    <>
                      <div style={{ marginTop: 12, marginBottom: 8, color: "#e74c3c", fontWeight: "bold" }}>
                        Essa ação é <u>permanente</u>! Digite sua senha para confirmar:
                      </div>
                      <input
                        type="password"
                        placeholder="Digite sua senha para excluir"
                        value={senhaExcluir}
                        onChange={(e) => setSenhaExcluir(e.target.value)}
                        style={{
                          borderRadius: 24,
                          padding: "10px 24px",
                          fontWeight: "bold",
                          border: "1px solid #e74c3c",
                          width: "100%",
                          maxWidth: 260,
                        }}
                      />
                      <button
                        type="button"
                        style={{
                          marginTop: 12,
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: 24,
                          padding: "10px 24px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          maxWidth: 260,
                        }}
                        onClick={handleExcluirConta}
                      >
                        CONFIRMAR EXCLUSÃO
                      </button>
                      <button
                        type="button"
                        style={{
                          marginTop: 8,
                          background: "#fff",
                          color: "#2c0383",
                          border: "1px solid #2c0383",
                          borderRadius: 24,
                          padding: "8px 24px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          maxWidth: 260,
                        }}
                        onClick={() => {
                          setMostrarConfirmacao(false);
                          setSenhaExcluir("");
                        }}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
                {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
                {sucesso && (
                  <div style={{ color: "green", marginTop: 8 }}>{sucesso}</div>
                )}
              </form>
            </PersonalData>
          </LeftColumn>
        </PageContent>
        <Image src={planet_blue} alt="Planeta Azul" />
      </Container>
    </>
  );
}
