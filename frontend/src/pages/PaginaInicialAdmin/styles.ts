import styled from "styled-components";

export {
  Container,
  Content,
  PlanetImage,
  DescriptionContainer,
  DescriptionText,
} from "../PaginaInicialProfessor/styles";

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

export const MenuOption = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 55px;
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