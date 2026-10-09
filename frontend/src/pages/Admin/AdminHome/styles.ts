import styled from "styled-components";
import { ButtonContainer } from "../../../components/Button/styles";

import { MenuOption as ProfessorMenuOption } from "../../PaginaInicialProfessor/styles";

export const CreateUserLink = styled(ButtonContainer)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  width: auto;
  height: auto;
  min-height: 44px;
  max-width: 100%;
  margin: 20px 0 0;
  padding: 10px 24px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 150ms ease;

  svg { flex-shrink: 0; }

  &:active { transform: translateY(2px); }
  &:focus-visible {
    outline: 3px solid white;
    outline-offset: 4px;
  }

  @media (max-width: 600px) {
    width: 100%;
    min-height: 46px;
    padding: 10px 16px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 20px 0 30px;
`;

export const MenuOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 200px));
  gap: 16px;

  background-color: white;
  padding: 20px;
  border-radius: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
    width: calc(100% - 40px);
    max-width: 400px;
    gap: 12px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    max-width: 280px;
  }
`;

export const MenuOption = styled(ProfessorMenuOption)`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 55px;
  width: auto;
  padding: 5px 16px;

  background-color: ${(props) => props.theme.colors.indigo};
  color: white;

  border-radius: 20px;

  font-weight: bold;
  text-align: center;
  text-decoration: none;

  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
  }

  &:active {
    scale: 0.97;
  }
`;


export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 28px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardCard = styled.article`
  background: white;
  color: #252547;
  border-radius: 20px;
  padding: 22px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;

  h2 {
    font-size: 16px;
    margin: 0 0 12px;
  }

  strong {
    font-size: 32px;
    font-weight: 800;
    color: ${(props) => props.theme.colors.indigo};
  }
`;

export const RecentUsersSection = styled.section`
  margin-top: 32px;
  padding: 24px;
  background: white;
  color: #252547;
  border-radius: 20px;
  text-align: left;

  h2 {
    margin: 0 0 20px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const RecentUsersList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const RecentUserItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #e6e6e6;

  &:last-child {
    border-bottom: none;
  }

  div {
    min-width: 0;
  }

  strong {
    display: block;
    overflow-wrap: anywhere;
  }

  span {
    display: block;
    color: #626274;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const DashboardFeedback = styled.p`
  margin: 24px 0;
  text-align: center;
`;
