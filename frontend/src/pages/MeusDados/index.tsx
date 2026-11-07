import React, { useEffect, useState } from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  PersonalData,
  LogoBottom,
  SaveButton,
  DadosTitle,
  DadosDescricao,
  Image,
  DeletionNotice,
} from "./styles";
import Header from "../../components/Header";
import logo from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import { alunoService } from "../../services/alunoService";

export default function MeusDados({ embedded = false }: { embedded?: boolean }) {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipo, setTipo] = useState<"student" | "teacher" | "admin">(() => {
    const salvo = localStorage.getItem("userType");
    return salvo === "teacher" || salvo === "admin" ? salvo : "student";
  });

  useEffect(() => {
    async function fetchDados() {
      try {
        const token = localStorage.getItem("token") || "";
        const { data } = await alunoService.meusDados(token);
        const userType = data.type as "student" | "teacher" | "admin";
        setTipo(userType || "student");
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
      const dados: any = {
        name: nome,
        email,
      };
      if (senha) dados.password = senha;
      if (tipo === "student") dados.registrationStudent = matricula;
      else if (tipo === "teacher") dados.registrationTeacher = matricula;
      await alunoService.atualizarDados(dados, token);
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

  return (
    <Container>
      {!embedded && <Header />}
      {!embedded && <LogoBottom src={logo} alt="Progete logo rodapé" />}
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
                {tipo !== "admin" && <InputWrapper>
                  <label>{tipo === "student" ? "Matrícula:" : "SIAPE:"}</label>
                  <input
                    type="text"
                    name="matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                  />
                </InputWrapper>}
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
                </div>
                {tipo !== "admin" && (
                  <DeletionNotice role="note">
                    <strong>Excluir conta</strong>
                    <span>
                      A exclusão de contas é feita pela administração do Progete. Para
                      solicitar a exclusão da sua conta, procure a administração.
                    </span>
                  </DeletionNotice>
                )}
                {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
                {sucesso && (
                  <div style={{ color: "green", marginTop: 8 }}>{sucesso}</div>
                )}
              </form>
            </PersonalData>
          </LeftColumn>
      </PageContent>
      <Image src={planetOrange} alt="" />
    </Container>
  );
}
