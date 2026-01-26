import React, { useState } from "react";
import "./style";

// components
import Header from "../../components/Header";
import { AlunoRanking } from "../../components/AlunoRanking";

import {
  Pagina,
  TituloPagina,
  SubTituloPagina,
  LogoProgete,
  PageContent,
  PlanetaAzulClaro,
  InfosProfessor,
  NomeProfessor,
  ContatoProfessor,
  QuantAlunos,
  QuantAlunosValor,
  ProfessorEturma,
  OpcoesTurma,
  VizualizarAtividades,
  VizualizarMembros,
  ColocacaoAluno,
  ColocacaoTexto,
  RankingAlunos,
  Estrelas,
} from "../DetalhesDaTurma/style";

// images
import ProgetePng from "../../assets/progete.png";
import ProgeteAzulClaro from "../../assets/planeta-azul-claro.png";
import userIcon from "../../assets/icons/user-icon.svg";
import peopleGroup from "../../assets/icons/people-group-icon.svg";
import medalIcon from "../../assets/icons/medal-icon.svg";
import starIcon from "../../assets/icons/star-icon.svg";

export default function DetalhesDaTurma() {
  const [alunos] = useState([
    { id: 1, nome: "Aluno 1" },
    { id: 2, nome: "Aluno 2" },
    { id: 3, nome: "Aluno 3" },
    { id: 4, nome: "Aluno 4" },
    { id: 5, nome: "Aluno 5" },
  ]);

  return (
    <>
      <Header />
      <Pagina>
        <TituloPagina>"Nome da turma"</TituloPagina>
        <SubTituloPagina>
          Aqui você vizualiza suas atividades e informações <br />
          sobre a turma.
        </SubTituloPagina>
        <LogoProgete src={ProgetePng} alt="Logo Progete" />
        <PlanetaAzulClaro src={ProgeteAzulClaro} alt="" />
        <PageContent>
          <ProfessorEturma>
            <InfosProfessor>
              <img src={userIcon} width={60} alt="Ícone de perfil" />
              <div>
                <NomeProfessor>Professor(a): "Nome Professor(a)"</NomeProfessor>
                <ContatoProfessor>Contato: email@email.com</ContatoProfessor>
              </div>
            </InfosProfessor>

            <QuantAlunos>
              <img
                src={peopleGroup}
                width={60}
                alt="Ícone de grupo de pessoas"
              />
              <QuantAlunosValor>
                Alunos na turma: 40 matriculados
              </QuantAlunosValor>
            </QuantAlunos>
          </ProfessorEturma>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <OpcoesTurma>
              <VizualizarAtividades>Visualizar atividades</VizualizarAtividades>
              <VizualizarMembros>Visualizar membros</VizualizarMembros>
            </OpcoesTurma>
            <ColocacaoAluno>
              <img src={medalIcon} width={60} alt="Ícone de grupo de pessoas" />
              <ColocacaoTexto>
                Até o momento, você está com 9° lugar nessa turma.
              </ColocacaoTexto>
            </ColocacaoAluno>
          </div>

          <RankingAlunos>
            <Estrelas>
              <img src={starIcon} width={30} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={60} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={30} alt="icone de estrela" />
            </Estrelas>

            {alunos.map((aluno) => (
              <AlunoRanking
                key={aluno.id}
                posicaoAluno={aluno.id}
                nomeAluno={aluno.nome}
              />
            ))}
          </RankingAlunos>
        </PageContent>
      </Pagina>
    </>
  );
}
