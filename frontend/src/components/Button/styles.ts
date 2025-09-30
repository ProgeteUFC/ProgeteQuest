import styled from "styled-components";
import type { DefaultTheme } from "styled-components";


interface ButtonContainerProps {
  bgColor?: keyof DefaultTheme['colors']; // Define bgColor como uma chave das cores do tema
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  display: flex;
  width: 208px;
  height: 27px;
  border-radius: 20px;
  border: 0;
  align-items: center;
  justify-content: center;
  margin: 7px;
  cursor: pointer;

  background-color: ${({ bgColor, theme }) =>
    bgColor ? theme.colors[bgColor] : theme.colors.indigo};

`;

export const Title = styled.p`
    font-size: ${props => props.theme.fontSize.p12}px;
`