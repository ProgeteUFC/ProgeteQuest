import React from "react";
import "./style";
import logoProgeteQuest from "../../assets/logo.png";
import iconCasa from "../../assets/icons/icon-casa.png";
import iconSair from "../../assets/icons/icon-sair.png";
import {
  MenuContainer,
  MenuOptions,
  Logo,
  MenuOption,
  MenuContent,
  IconSair,
  IconCasa
} from "./style";

export default function Header() {
  return (
    <>
      <MenuContainer>
        <Logo>
          <img src={logoProgeteQuest} alt="Logo do Progete Quest" width={200} />
        </Logo>
        <MenuContent>
          <a href="#">
            <IconCasa><img src={iconCasa} alt="Ícone que leva para Login" width={40} /></IconCasa>
          </a>
          <MenuOptions>
            <MenuOption>Cadastrar Disciplina</MenuOption>
            <MenuOption>Disciplinas</MenuOption>
            <MenuOption>Meus Dados</MenuOption>
            <MenuOption>Suporte</MenuOption>
          </MenuOptions>
          <a href="/">
            <IconSair>
              <img src={iconSair} alt="Ícone que leva para Login" width={32} />
              <p>Sair</p>
            </IconSair>
          </a>
        </MenuContent>
      </MenuContainer>
    </>
  );
}
