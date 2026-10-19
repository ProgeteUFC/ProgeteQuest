import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderProfessor from "../../components/HeaderProfessor";
import { adminService, adminErrorMessage, type ManagedUser } from "../../services/adminService";
import progeteLogo from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import { Container, Content, Title, Subtitle, Form, NameField, CreateButton, Feedback, LogoProgete, Planet } from "./style";

const API_URL = import.meta.env.VITE_API_URL;

export default function CadastrarDisciplina({ embedded = false }: { embedded?: boolean }) {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userType") === "admin";
  const [professores, setProfessores] = useState<ManagedUser[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(isAdmin);
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    async function load() {
      try {
        const teachers: ManagedUser[] = [];
        let page = 1;
        let totalPages = 1;
        do {
          const result = await adminService.listarUsuarios({ type: "teacher", status: "active", page, limit: 100 });
          teachers.push(...result.data);
          totalPages = result.meta.totalPages;
          page++;
        } while (page <= totalPages);
        if (active) setProfessores(teachers);
      } catch (error) { if (active) setErro(adminErrorMessage(error)); }
      finally { if (active) setLoadingTeachers(false); }
    }
    void load();
    return () => { active = false; };
  }, [isAdmin]);

  async function handleCriarTurma(event: React.FormEvent) {
    event.preventDefault();
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      setErro("Informe o nome da turma.");
      return;
    }
    if (isAdmin && !teacherId) { setErro("Selecione o professor responsável."); return; }

    try {
      setEnviando(true);
      setErro("");
      const token = localStorage.getItem("token") || "";
      await axios.post(
        `${API_URL}/class`,
        { name: nomeNormalizado, ...(isAdmin ? { teacherId } : {}) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(isAdmin ? "/admin/classes" : "/visualizarTurmasProfessor");
    } catch (err: any) {
      setErro(adminErrorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Container>
      {!embedded && <HeaderProfessor />}
      <Content>
        <Title>Criar turma</Title>
        <Subtitle>{isAdmin ? "Crie uma turma e escolha seu professor responsável." : "Crie uma turma para realizar atividades com seus alunos."}</Subtitle>
        <Form onSubmit={handleCriarTurma}>
          {isAdmin && <NameField>Professor responsável
            <select required value={teacherId} onChange={(event) => setTeacherId(event.target.value)} disabled={loadingTeachers || enviando}>
              <option value="">{loadingTeachers ? "Carregando professores..." : "Selecione um professor"}</option>
              {professores.map((teacher) => <option key={teacher.userId} value={teacher.userId}>{teacher.name} — {teacher.email}</option>)}
            </select>
            {!loadingTeachers && professores.length === 0 && <p>Nenhum professor ativo disponível. Cadastre ou reative um professor.</p>}
          </NameField>}
          <NameField>
            Nome da turma
            <input required disabled={enviando} value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex.: Requisitos de Software" maxLength={50} aria-label="Nome da turma" />
          </NameField>
          {erro && <Feedback role="alert">{erro}</Feedback>}
          <CreateButton type="submit" disabled={enviando || loadingTeachers || (isAdmin && professores.length === 0)}>{enviando ? "CRIANDO..." : "CRIAR"}</CreateButton>
        </Form>
      </Content>
      {!embedded && <LogoProgete src={progeteLogo} alt="Progete" />}
      <Planet src={planetOrange} alt="" />
    </Container>
  );
}
