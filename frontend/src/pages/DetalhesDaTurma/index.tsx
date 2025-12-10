import React from "react";
import "./style";
import Header from "../../components/Header";

import {
  Pagina,
  TituloPagina,
  SubTituloPagina,
  DivSenha,
  InputSenha,
  LabelSenha,
  IconEnviarSenha,
  LogoProgete,
  PageContent,
  PlanetaAzulClaro,
  InfosProfessor,
} from "../DetalhesDaTurma/style";

import ProgetePng from "../../assets/progete.png";
import ProgeteAzulClaro from "../../assets/planeta-azul-claro.png";

export default function DetalhesDaTurma() {
  return (
    <>
      <Header />
      <Pagina>
        <TituloPagina>"Nome da turma"</TituloPagina>
        <PageContent>
          <SubTituloPagina>
            Aqui você vizualiza suas atividades e informações sobre a turma.
          </SubTituloPagina>
        </PageContent>
        <LogoProgete src={ProgetePng} width={200} alt="" />
        <PlanetaAzulClaro src={ProgeteAzulClaro} width={600} alt="" />
        <div>
          <div>
            <InfosProfessor>

            </InfosProfessor>
            
            <OpcoesTurma>
                
            </OpcoesTurma>
          </div>

          <div>
            <div></div>
            <div></div>
          </div>

          <div>

          </div>
        </div>
      </Pagina>
    </>
  );
}
