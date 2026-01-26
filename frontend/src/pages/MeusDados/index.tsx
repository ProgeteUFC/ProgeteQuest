import React from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  PersonalData,
  LogoBottom,
  HeaderContainer,
  SaveButton,
} from "./styles";
import Header from "../../components/Header";

import { TitleName } from "../../components/TitleName";
import { Image } from "./styles";

import logo from "../../assets/progete.png";
import planet_blue from "../../assets/planet_blue_anel.png";

export default function MeusDados() {
  return (
    <>
      <Header />
      <Container>
        <LogoBottom src={logo} alt="Progete logo rodapé" />

        <PageContent>
          <LeftColumn>
            <HeaderContainer>
              <div className="title-wrapper">
                <TitleName titleName="Dados Pessoais" />
              </div>

              <p className="subtitle">
                Aqui você pode visualizar e editar <br /> seus dados pessoais.
              </p>
            </HeaderContainer>

            <PersonalData>
              <form>
                <InputWrapper>
                  <label>Nome:</label>
                  <input type="text" name="nome" required />
                </InputWrapper>

                <InputWrapper>
                  <label>Curso:</label>
                  <input type="text" name="curso" required />
                </InputWrapper>

                <InputWrapper>
                  <label>Matrícula:</label>
                  <input type="text" name="matricula" required />
                </InputWrapper>

                <InputWrapper>
                  <label>E-mail:</label>
                  <input type="email" name="email" required />
                </InputWrapper>

                <InputWrapper>
                  <label>Senha:</label>
                  <input type="password" name="senha" required />
                </InputWrapper>

                <InputWrapper>
                  <label>Repita sua senha:</label>
                  <input type="password" name="senhaConfirm" required />
                </InputWrapper>
              </form>
            </PersonalData>

            <div className="button-group-vertical">
              <SaveButton type="submit">SALVAR</SaveButton>
            </div>
          </LeftColumn>
        </PageContent>
        <Image src={planet_blue} alt="Planeta Azul" />
      </Container>
    </>
  );
}
