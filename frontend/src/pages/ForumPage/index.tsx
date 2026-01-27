import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import {
  Container,
  Content,
  ListaTurmas,
  ListaTurmasScroll,
  TurmaCard,
  TurmaNome,
  PlanetImage,
} from "./styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";

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
  return (
    <Container>
      <Header />
      <Content>
        <TitleName titleName="Fórum" />
        <TitleDescription titleDescription="Escolha o fórum da turma desejada para conversar e tirar dúvidas com seus colegas." />
        <ListaTurmas>
          <ListaTurmasScroll>
            {turmas.map((turma) => (
              <TurmaCard key={turma.id} tabIndex={0}>
                <TurmaNome>{turma.nome}</TurmaNome>
              </TurmaCard>
            ))}
          </ListaTurmasScroll>
        </ListaTurmas>
      </Content>
      <Footer />
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
}