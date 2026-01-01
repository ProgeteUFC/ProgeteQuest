import React from "react";
import {
  Container,
  LeftColumn,
  PageContent,
  InputWrapper,
  Register,
  LogoTop,
  LogoBottom,
  Planet,
  RightArtwork,
  HeaderContainer,
  CadastrarButton,
} from "./style";
import { Button } from "../../components/Button";
import { TitleName } from "../../components/TitleName";

import logo from "../../assets/progete.png";
import planet from "../../assets/planet_orange.png";
import artwork from "../../assets/logo.png";

export default function RegisterPage() {
  return (
    <Container>
      <LogoTop src={logo} alt="Progete logo topo" />
      <LogoBottom src={logo} alt="Progete logo rodapé" />
      <Planet src={planet} alt="planet" />

      <PageContent>
        <LeftColumn>
          <HeaderContainer>
            <div className="title-wrapper">
              <TitleName titleName="Cadastro" />
            </div>

            <p className="subtitle">
              Novo usuário? Insira seus dados abaixo e confirme seu cadastro.
            </p>
          </HeaderContainer>

          <Register>
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
          </Register>

          <div className="button-group-vertical">
            <CadastrarButton type="submit">CADASTRAR</CadastrarButton>
          </div>
        </LeftColumn>

        <RightArtwork src={artwork} alt="Progete Quest" />
      </PageContent>
    </Container>
  );
}
