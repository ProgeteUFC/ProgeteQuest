import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderProfessor from "../../components/HeaderProfessor";
import progeteLogo from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import { Container, Content, Title, Subtitle, Form, NameField, DescriptionField, CreateButton, Feedback, LogoProgete, Planet } from "./style";

const API_URL = import.meta.env.VITE_API_URL;

export default function CadastrarDisciplina() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleCriarTurma(event: React.FormEvent) {
    event.preventDefault();
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      setErro("Informe o nome da turma.");
      return;
    }

    try {
      setEnviando(true);
      setErro("");
      const token = localStorage.getItem("token") || "";
      const teacherId = localStorage.getItem("userId") || "";
      await axios.post(
        `${API_URL}/class`,
        { name: nomeNormalizado, description: descricao.trim(), teacherId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/visualizarTurmasProfessor");
    } catch (err: any) {
      setErro(err?.response?.data?.message || "Não foi possível criar a turma.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Container>
      <HeaderProfessor />
      <Content>
        <Title>Criar turma</Title>
        <Subtitle>Aqui você pode criar uma turma para a realização das<br /> atividades com os alunos</Subtitle>
        <Form onSubmit={handleCriarTurma}>
          <NameField>
            <strong>Nome da turma:</strong>&nbsp;
            <input value={nome} onChange={(event) => setNome(event.target.value)} placeholder=" Ex.: Requisitos de Software" maxLength={50} aria-label="Nome da turma" />
          </NameField>
          <DescriptionField>
            <div>
              <strong>Descrição:</strong>
              {!descricao && <span>(Opcional)</span>}
            </div>
            <textarea
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              aria-label="Descrição da turma"
            />
          </DescriptionField>
          {erro && <Feedback role="alert">{erro}</Feedback>}
          <CreateButton type="submit" disabled={enviando}>{enviando ? "CRIANDO..." : "CRIAR"}</CreateButton>
        </Form>
      </Content>
      <LogoProgete src={progeteLogo} alt="Progete" />
      <Planet src={planetOrange} alt="" />
    </Container>
  );
}
