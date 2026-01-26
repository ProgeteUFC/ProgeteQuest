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

export default function Header() {
  return (
    <MenuContainer>
      <Logo>
        <img src={logoProgeteQuest} alt="Logo do Progete Quest" width={200} />
      </Logo>
      <MenuContent>
        <Box>
          <IconHome>
            <TiHome size={30} />
          </IconHome>
        </Box>
        <MenuOptions>
          <MenuOption>Entrar em uma turma</MenuOption>
          <MenuOption>Minhas Turmas</MenuOption>
          <MenuOption>Meus dados</MenuOption>
          <MenuOption>Fórum</MenuOption>
        </MenuOptions>
      </MenuContent>
      <RightBox>
        <IconExite>
          <IoExitOutline size={30} />
          <span>Sair</span>
        </IconExite>
      </RightBox>
    </MenuContainer>
  );
}
