import React, { useEffect } from "react";
import Header from "../../components/Header";
import { Container, PageWrapper } from "./styles";


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
            Aqui você pode criar uma turma para a realização das atividades com os alunos
          </h2>
        </Container>
      </PageWrapper>
    </>
  );
}