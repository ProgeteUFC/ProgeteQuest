import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import HeaderProfessor from "../../components/HeaderProfessor";
import {
  Container,
  Content,
  ListaTurmas,
  ListaTurmasScroll,
  TurmaCard,
  TurmaNome,
  PlanetImage,
  ForumTitle,
  ForumDescription,
  AstronautImage,
} from "./styles";
import planet_orange from "../../assets/planet_orange.png";


const turmas = [
  { id: "1", nome: "Processos de Software" },
  { id: "2", nome: "Gerência de Projetos" },
  { id: "3", nome: "Qualidade de Software" },
  { id: "4", nome: "Requisitos de Software" },
  { id: "5", nome: "Banco de Dados" },
  { id: "6", nome: "Engenharia de Software" },
  { id: "7", nome: "Redes de Computadores" },
  { id: "8", nome: "Estruturas de Dados" },
  { id: "9", nome: "Algoritmos" },
  { id: "10", nome: "Sistemas Operacionais" },
  { id: "11", nome: "Inteligência Artificial" },
  { id: "12", nome: "Compiladores" },
];

export default function ForumPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <HeaderProfessor />
      <Content>
        <ForumTitle>Fórum</ForumTitle>
        <ForumDescription>
          Escolha o fórum da turma desejada para conversar e tirar dúvidas com seus colegas.
        </ForumDescription>
        <ListaTurmas>
          <ListaTurmasScroll>
            {turmas.map((turma) => (
              <TurmaCard
                key={turma.id}
                tabIndex={0}
                onClick={() => navigate(`/forum/${turma.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TurmaNome>{turma.nome}</TurmaNome>
              </TurmaCard>
            ))}
          </ListaTurmasScroll>
        </ListaTurmas>
      </Content>
      <Footer />
      <PlanetImage src={planet_orange} alt="Planeta Laranja" />
    </Container>
  );
}