import React from "react";
import { ButtonDisciplinas } from "../../components/ButtonDisciplinas";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import { Container, Content, Disciplinas, PlanetImage } from "./styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";

export function MinhasTurmas() {
  return (
    <Container>
      <Header />
      <Content>
        <TitleName titleName="Minhas turmas" />

        <TitleDescription titleDescription="Aqui você pode consultar as turmas em que você está matriculado(a)" />

        <Disciplinas>
          <ButtonDisciplinas title="Processos de Software" />
          <ButtonDisciplinas title="Gerência de Projetos" />
          <ButtonDisciplinas title="Qualidade de Software" />
          <ButtonDisciplinas title="Requisitos de Software" />
        </Disciplinas>
      </Content>
      <Footer />
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
}
