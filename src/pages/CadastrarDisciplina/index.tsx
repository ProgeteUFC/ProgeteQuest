import React from "react";
import "./style";
import Header from "../../components/Header";
import { Pagina, TituloPagina, SubTituloPagina, DivSenha, InputSenha, LabelSenha, LogoProgete, PageContent, PlanetaCadastrar} from "./style";

// imagens
import ProgetePng from "../../assets/progete.png";

export default function CadastrarDisciplina() {
  return (
    <>
      <Header />
      <Pagina>
        <TituloPagina>Cadastrar Disciplina</TituloPagina>
        <PageContent>
          <SubTituloPagina>
            Para se cadastrar em uma disciplina, digite a senha fornecida pelo
            professor(a)
          </SubTituloPagina>
          <DivSenha>
            <InputSenha type="password" id="senha" />
            <LabelSenha htmlFor="senha">Senha:</LabelSenha>
          </DivSenha>
        </PageContent>
        <LogoProgete src={ProgetePng} width={200} alt="" />
        <PlanetaCadastrar src="" width={600} alt="" />
      </Pagina>
    </>
  );
}
