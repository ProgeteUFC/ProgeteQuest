import React from "react";
import "./style";
import Header from "../../components/Header";
import { Pagina, TituloPagina, SubTituloPagina, DivSenha, InputSenha, LabelSenha, IconEnviarSenha, LogoProgete, PageContent, PlanetaCadastrar} from "./style";

// imagens
import ProgetePng from "../../assets/progete.png";
import PlanetaCadastro from "../../../src/assets/planeta-roxo-amarelo.png"
import IconSenha from "../../assets/icons/icon-enviar-senha.png"

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
            <IconEnviarSenha src={IconSenha} width={35} alt="" />
          </DivSenha>
        </PageContent>
        <LogoProgete src={ProgetePng} width={200} alt="" />
        <PlanetaCadastrar src={PlanetaCadastro} width={700} alt="" />
      </Pagina>
    </>
  );
}
