import React from "react";
import { ButtonContainer, Title } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isActive?: boolean;
}

export function Button({ title, isActive, ...rest }: ButtonProps) {
  return (
    <ButtonContainer className={isActive ? "active" : ""} {...rest}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
}
