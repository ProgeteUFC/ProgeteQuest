import React, { useEffect } from "react";
import Header from "../../components/Header";
import logo from "../../assets/progete.png";
import PlanetOrange from "../../assets/planet_orange.png";
import { Container, PageWrapper, FormCard, CreateButton, ButtonWrapper, Logo, Planet } from "./styles";



export default function CriarTurma() {
    useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <>
        
      <Header />
      <PageWrapper>
        <Container>
          <h1>Criar turma</h1>
          <h2>
            Aqui você pode criar uma turma para a realização das <br />
             atividades com os alunos
          </h2>
          <FormCard>
          <input type="text" placeholder="Nome da turma " />
  <textarea placeholder="Descrição (opcional)" />
        </FormCard>

        <ButtonWrapper>
        <CreateButton>CRIAR</CreateButton>
        </ButtonWrapper>
        </Container>
        <Planet src= {PlanetOrange} alt="planeta laranja" />
        <Logo src={logo} alt="logo do projeto" />
   
      </PageWrapper>
    </>
  );
}