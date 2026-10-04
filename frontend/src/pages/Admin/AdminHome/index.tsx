import { Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import styled from "styled-components";
import { TitleName } from "../../../components/TitleName";
import { adminMenu } from "../../../components/HeaderAdmin/menu";
import { MenuContainer, MenuOptions, MenuOption, CreateUserLink } from "./styles";

const Content = styled.section`
  padding: 32px 16px;
  max-width: 1100px;
  margin: auto;
  text-align: center;
  & h1 { font-size: clamp(24px, 4vw, 36px); line-height: 1.3; }
`;

export default function AdminHome() {
  return <Content>
    <TitleName titleName="Olá, Administrador(a)! O que você deseja fazer?" />
    <MenuContainer><MenuOptions>
      {adminMenu.slice(1).map(item => <MenuOption as={Link} to={item.to} key={item.to}>{item.label}</MenuOption>)}
    </MenuOptions></MenuContainer>
    <p>Gerencie os usuários e recursos do ProgeteQuest.</p>
    <CreateUserLink as={Link} to="/admin/users/new">
      <FiUserPlus size={20} aria-hidden="true" />
      <span>Cadastrar novo usuário</span>
    </CreateUserLink>
  </Content>;
}
