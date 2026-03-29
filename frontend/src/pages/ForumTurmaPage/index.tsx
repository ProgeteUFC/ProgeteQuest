import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Container, Content, PlanetImage, ForumTitle, ForumDescription } from "../ForumPage/styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";
import ForumList, { Forum } from "../../components/ForumList";

import ForumCreateForm from "../../components/ForumCreateForm";
import { BackButton, BackButtonContainer, BackButtonNotFound } from "./styles";
import { Link } from "react-router-dom";


const courses = [
  { id: "1", name: "Processos de Software" },
  { id: "2", name: "Gerência de Projetos" },
  { id: "3", name: "Qualidade de Software" },
  { id: "4", name: "Requisitos de Software" },
  { id: "5", name: "Banco de Dados" },
];

const mockForums: Record<string, Forum[]> = {
  "1": [
    { id: "f1", title: "Dúvida sobre requisitos", message: "Alguém pode explicar o que é backlog?", author: "Maria Silva" },
    { id: "f2", title: "Prova próxima semana", message: "A prova será presencial?", author: "João Souza" },
  ],
  "2": [
    { id: "f3", title: "Entrega do projeto", message: "Qual o prazo final?", author: "Ana Lima" },
  ],
};

const getForumsByCourse = (courseId: string): Forum[] => {
  return mockForums[courseId] || [];
};

const ForumTurmaPage: React.FC = () => {
  const { turmaId } = useParams<{ turmaId: string }>();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === turmaId);
  const [forums, setForums] = useState<Forum[]>([]);

  useEffect(() => {
    if (turmaId) setForums(getForumsByCourse(turmaId));
  }, [turmaId]);

  const handleCreateForum = (title: string, message: string) => {
    if (!turmaId) return;
    const newForum: Forum = {
      id: `f${Date.now()}`,
      title,
      message,
      author: "Você",
    };
    setForums((prev) => [newForum, ...prev]);
  };

  if (!course) {
    return (
      <Container>
        <Header />
        <Content>
          <ForumTitle>Turma não encontrada</ForumTitle>
          <div style={{ marginTop: 40, marginLeft: 430, display: 'flex', justifyContent: 'flex-start' }}>
            <BackButtonNotFound onClick={() => navigate('/forum')}>Voltar</BackButtonNotFound>
          </div>
        </Content>
        <Footer />
        <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <ForumTitle>Fórum - {course.name}</ForumTitle>
        <ForumDescription>Veja os fóruns existentes ou crie um novo para esta turma.</ForumDescription>
        <ForumCreateForm onCreate={handleCreateForum} />
        <ForumList forums={forums} />
        <BackButtonContainer>
          <BackButton onClick={() => navigate('/forum')}>Voltar</BackButton>
        </BackButtonContainer>
      </Content>
      <Footer />
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
};

export default ForumTurmaPage;
