import React, { useState } from "react";
import logoProgeteQuest from "../../assets/logo.png";
import { TiHome } from "react-icons/ti";
import { IoExitOutline } from "react-icons/io5";
import {
  MenuContainer,
  MenuOptions,
  Logo,
  MenuOption,
  MenuContent,
  RightBox,
} from "./style";
import { IconHome, IconExite, Box } from "../headerRanking/styles";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { HamburgerButton, MobileMenu } from "./style";
import HeaderProfessor from "../HeaderProfessor";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (localStorage.getItem("userType") === "teacher") {
    return <HeaderProfessor />;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    navigate("/");
  }

  return (
    <MenuContainer className={className}>
      <HamburgerButton onClick={() => setMobileMenuOpen((open) => !open)}>
        <GiHamburgerMenu size={30} />
      </HamburgerButton>
      <Logo>
        <img src={logoProgeteQuest} alt="Logo do Progete Quest" width={200} />
      </Logo>

      <MenuContent>
        <Box>
          <IconHome>
            <Link to="/minhasTurmas">
              <TiHome size={30} />
            </Link>
          </IconHome>
        </Box>

        <MenuOptions>
          <MenuOption as={Link} to="/entrarEmTurma">
            Entrar em uma turma
          </MenuOption>

          <MenuOption as={Link} to="/minhasTurmas">
            Minhas Turmas
          </MenuOption>

          <MenuOption as={Link} to="/meusDados">
            Meus dados
          </MenuOption>

          <MenuOption as={Link} to="/forum">
            Fórum
          </MenuOption>
        </MenuOptions>
      </MenuContent>

      <MobileMenu open={mobileMenuOpen}>
        <MenuOptions style={{ flexDirection: "column", gap: 24 }}>
          <MenuOption as={Link} to="/minhasTurmas" onClick={() => setMobileMenuOpen(false)}>
            Tela Inicial
          </MenuOption>
          <MenuOption as={Link} to="/entrarEmTurma" onClick={() => setMobileMenuOpen(false)}>
            Entrar em uma turma
          </MenuOption>

          <MenuOption as={Link} to="/minhasTurmas" onClick={() => setMobileMenuOpen(false)}>
            Minhas Turmas
          </MenuOption>

          <MenuOption as={Link} to="/meusDados" onClick={() => setMobileMenuOpen(false)}>
            Meus dados
          </MenuOption>

          <MenuOption as={Link} to="/forum" onClick={() => setMobileMenuOpen(false)}>
            Fórum
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
