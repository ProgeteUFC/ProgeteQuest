import styled from "styled-components";

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  justify-content: flex-start;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
  padding: 0 8px; 
  gap: 12px; 
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 12px; 
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 20px; 
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
    transition: background 0.2s, color 0.2s;
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const MenuContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-left: 245px; 
`;

export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  color: white;
  align-items: center;
  border-radius: 50px;
  padding: 1px 0px;
  width: 200px;
  justify-content: center;
  gap: 30px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;

  &:active {
    scale: 0.97;
    transition-duration: 100ms;
  }
  
  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const Logo = styled.div`
  padding: 10px;
`;


export const Box = styled.div`
  gap: 15px;
  display: flex;
`;

export const IconHome = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  svg {
    color: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;

export const IconExite = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
  gap: 5px;
  span {
    font-family: "Codec Pro", sans-serif;
    font-size: 13px;
    font-weight: 600;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
    span {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;

export const RightBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 8px;
`;
