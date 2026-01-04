import styled from "styled-components";

export const ButtonContainer = styled.button`
  display: flex;
  width: 208px;
  height: 27px;
  color: white;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.indigo};
  border: 0;
  color: ${(props) => props.theme.colors.white};
  align-items: center;
  justify-content: center;
  margin: 7px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
  }
`;

export const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.p14}px;
  white-space: nowrap;
`;
