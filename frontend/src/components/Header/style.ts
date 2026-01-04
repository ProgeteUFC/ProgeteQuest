import styled from "styled-components";

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  border: 0;
  color: ${(props) => props.theme.colors.white};
  align-items: center;
  justify-content: space-around;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 22px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

export const Button = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 22px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const MenuContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  border-radius: 50px;
  padding: 1px 0px;
  width: 200px;
  justify-content: center;
  gap: 30px;
  font-weight: bold;
  cursor: pointer;

  &:active {
    scale: 0.97;
    background-color: ${(props) => props.theme.colors.challengeOrange};
    transition-duration: 100ms;
  }
`;

export const Logo = styled.div`
  padding: 10px;
`;

export const IconSair = styled.div`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding-left: 5px;

  &:active {
    scale: 0.97;
    transition-duration: 20ms;
  }
`;

export const IconCasa = styled.div`
  padding-top: 10px;

  &:active {
    scale: 0.97;
    transition-duration: 20ms;
  }
`;
