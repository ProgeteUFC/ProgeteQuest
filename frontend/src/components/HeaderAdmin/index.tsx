import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoProgeteQuest from "../../assets/logo.png";

import { TiHome } from "react-icons/ti";
import { IoExitOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

import {
  MenuContainer,
  MenuOptions,
  Logo,
  MenuOption,
  MenuContent,
  RightBox,
  HamburgerButton,
  MobileMenu,
}from "./style";

import {
  IconHome,
  IconExite,
  Box,
} from "../headerRanking/styles";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  navigate("/");
}

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <MenuContainer>
      <HamburgerButton
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <GiHamburgerMenu size={30} />
      </HamburgerButton>

      <Logo>
        <img
          src={logoProgeteQuest}
          alt="Logo do Progete Quest"
          width={200}
        />
      </Logo>

      <MenuContent>
        <Box>
          <IconHome>
            <Link to="/admin">
              <TiHome size={30} />
            </Link>
          </IconHome>
        </Box>

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
      </MenuContent>

      <MobileMenu open={mobileMenuOpen}>
        <MenuOptions
          style={{
            flexDirection: "column",
            gap: 24,
          }}
        >
          <MenuOption
            as={Link}
            to="/admin"
            onClick={closeMobileMenu}
          >
            Início
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/usuarios"
            onClick={closeMobileMenu}
          >
            Usuários
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/turmas"
            onClick={closeMobileMenu}
          >
            Turmas
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/atividades"
            onClick={closeMobileMenu}
          >
            Atividades
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/foruns"
            onClick={closeMobileMenu}
          >
            Fóruns
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/auditoria"
            onClick={closeMobileMenu}
          >
            Auditoria
          </MenuOption>

          <MenuOption
            as={Link}
            to="/admin/meus-dados"
            onClick={closeMobileMenu}
          >
            Meus dados
          </MenuOption>
        </MenuOptions>
      </MobileMenu>

      <RightBox>
        <IconExite onClick={handleLogout}>
          <IoExitOutline size={30} />
          <span>Sair</span>
        </IconExite>
      </RightBox>
    </MenuContainer>
  );
}