import React from "react";
import { Link } from "react-router-dom";

import Footer from "../../components/Footer";
import HeaderAdmin from "../../components/HeaderAdmin";
import { TitleName } from "../../components/TitleName";

import {
  Container,
  Content,
  MenuContainer,
  MenuOption,
  MenuOptions,
  PlanetImage,
  DescriptionContainer,
  DescriptionText,
  AdminFooter,
} from "./styles";

import planetOrange from "../../assets/planet_orange.png";

const PaginaInicialAdmin = () => {
  return (
    <>
      <PlanetImage src={planetOrange} alt="Planeta Laranja" />

      <Container>
        <HeaderAdmin />

        <Content>
          <TitleName titleName="Olá, Administrador(a)! O que você deseja fazer ?" />

          <MenuContainer>
            <MenuOptions>
              <MenuOption as={Link} to="/admin/usuarios">
                Usuários
              </MenuOption>

              <MenuOption as={Link} to="/admin/turmas">
                Turmas
              </MenuOption>

              <MenuOption as={Link} to="/admin/atividades">
                Atividades
              </MenuOption>

              <MenuOption as={Link} to="/admin/foruns">
                Fóruns
              </MenuOption>

              <MenuOption as={Link} to="/admin/auditoria">
                Auditoria
              </MenuOption>

              <MenuOption as={Link} to="/admin/meus-dados">
                Meus dados
              </MenuOption>
            </MenuOptions>
          </MenuContainer>

          <DescriptionContainer>
            <DescriptionText style={{ fontWeight: "bold" }}>
              Gerencie usuários, turmas e atividades do ProgeteQuest.
            </DescriptionText>

            <DescriptionText style={{ fontWeight: "bold" }}>
              Acompanhe e administre os recursos da plataforma de forma simples
              e organizada.
            </DescriptionText>
          </DescriptionContainer>
        </Content>

        <AdminFooter>
          <Footer />
        </AdminFooter>
      </Container>
    </>
  );
};

export default PaginaInicialAdmin;