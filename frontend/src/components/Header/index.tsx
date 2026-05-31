import React from "react";
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

interface HeaderProps {
  className?: string;
}

export default function HeaderProfessor({ className }: HeaderProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    navigate("/");
  }

  return (
    <MenuContainer className={className}>
      <Logo>
        <img src={logoProgeteQuest} alt="Logo do Progete Quest" width={200} />
      </Logo>

      <MenuContent>
        <Box>
          <IconHome>
            <Link to="/paginaInicialProfessor">
              <TiHome size={30} />
            </Link>
          </IconHome>
        </Box>

        <MenuOptions>
          <MenuOption as={Link} to="/entrarEmTurma">
            Criar uma Turma
          </MenuOption>

          <MenuOption as={Link} to="/visualizarTurmasProfessor">
            Visualizar Turmas
          </MenuOption>

          <MenuOption as={Link} to="/meusDados">
            Meus dados
          </MenuOption>

          <MenuOption as={Link} to="/forum">
            Fórum
          </MenuOption>
        </MenuOptions>
      </MenuContent>

      <RightBox>
        <IconExite onClick={handleLogout}>
          <IoExitOutline size={30} />
          <span>Sair</span>
        </IconExite>
      </RightBox>
    </MenuContainer>
  );
}