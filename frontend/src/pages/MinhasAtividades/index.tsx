import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import {
  Container,
  Content,
  AtividadesContainer,
  AtividadeCard,
  AtividadeNome,
  AtividadeInfo,
  StatusIcon,
  Disciplina,
  PlanetImage,
} from "./styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const atividades = [
  {
    nome: "Atividade 1",
    inicio: "01/05/2025",
    fim: "02/05/2025 às 23:59",
    status: "ok",
  },
  {
    nome: "Atividade 2",
    inicio: "01/05/2025",
    fim: "02/05/2025 às 23:59",
    status: "fail",
  },
  {
    nome: "Atividade 3",
    inicio: "01/05/2025",
    fim: "02/05/2025 às 23:59",
    status: "ok",
  },
  {
    nome: "Atividade 3",
    inicio: "01/05/2025",
    fim: "02/05/2025 às 23:59",
    status: "ok",
  },
];

export function MinhasAtividades() {
  const location = useLocation();
  const turmaId = new URLSearchParams(location.search).get("turma");

  // Aqui você pode filtrar as atividades pelo turmaId
  // Exemplo:
  // const atividadesFiltradas = atividades.filter(a => a.turmaId === turmaId);

  return (
    <Container>
      <Header />
      <Content>
        <TitleName titleName="Atividades" />
        <TitleDescription titleDescription="Aqui você visualiza as atividades/desafios propostos pelo(a) professor(a) na turma de:" />
        <Disciplina>
          <span>Processos de Software</span>
        </Disciplina>
        <AtividadesContainer>
          {atividades.map((a, i) => (
            <AtividadeCard key={i}>
              <AtividadeNome>{a.nome}</AtividadeNome>
              <AtividadeInfo>
                Início: {a.inicio} <b>Finaliza em:</b> {a.fim}
                <StatusIcon status={a.status}>
                  {a.status === "ok" ? <FaCheckCircle /> : <FaTimesCircle />}
                </StatusIcon>
              </AtividadeInfo>
            </AtividadeCard>
          ))}
        </AtividadesContainer>
      </Content>
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
}
