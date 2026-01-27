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

export default function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    // Adicione aqui a lógica de logout se necessário
    navigate("/");
  }

  return (
    <MenuContainer>
      <Logo>
        <img src={logoProgeteQuest} alt="Logo do Progete Quest" width={200} />
      </Logo>
      <MenuContent>
        <Box>
          <IconHome>
            <Link to="/">
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
      <RightBox>
        <IconExite onClick={handleLogout}>
          <IoExitOutline size={30} />
          <span>Sair</span>
        </IconExite>
      </RightBox>
    </MenuContainer>
  );
}
