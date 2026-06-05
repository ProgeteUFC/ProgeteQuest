import React, { useEffect } from "react";
import HeaderProfessor from "../../components/HeaderProfessor";
import logo from "../../assets/progete.png";
import PlanetOrange from "../../assets/planet_orange.png";
import AstronautImg from "../../assets/astronaut.png"; // Importação correta como default
import { Container, PageWrapper, FormCard, CreateButton, ButtonWrapper, Logo, Planet, Astronaut } from "./styles";

export default function CriarTurma() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);
  
  return (
    
    <>
    
      <HeaderProfessor />
      
      
      <PageWrapper>
        <Container>
          <h1>Criar turma</h1>
          <h2>
            Aqui você pode criar uma turma para a realização das atividades com os alunos
          </h2>
          <FormCard>
            <input type="text" placeholder="Nome da turma" />
            <textarea placeholder="Descrição (opcional)" />
          </FormCard>
          <ButtonWrapper>
            <CreateButton>CRIAR</CreateButton>
          </ButtonWrapper>
        </Container>
        <Planet src={PlanetOrange} alt="planeta laranja" />
        <Astronaut src={AstronautImg} alt="astronauta" />
        <Logo src={logo} alt="logo do projeto" />
      </PageWrapper>
    </>
  );
}