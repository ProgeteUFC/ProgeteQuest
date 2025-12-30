import React from "react";
import { ButtonContainer, Title } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export function Button({ title, ...rest }: ButtonProps) {
  return (
    <ButtonContainer {...rest}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
}
