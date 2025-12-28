import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.indigo};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  transform: translateY(-90px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 30px;
`;

export const Position = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Icon = styled.div`
  cursor: pointer;
  svg {
    color: ${(props) => props.theme.colors.white}; /* 1. Cor padrão: white */
    transition: color 0.3s ease-in-out;
  }
  &:hover {
    svg {
      color: ${(props) =>
        props.theme.colors
          .lightOrange}; /* Cor ao passar o mouse: lightOrange */
    }
  }
`;
