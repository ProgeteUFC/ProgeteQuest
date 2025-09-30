import React from "react";
import { ButtonContainer, Title } from "./styles";

interface ButtonProps {
  title: string;
  bgColor?: "primaryDark" | "kingfisherDaisy" | "indigo" | "white" | "primary" | "primaryLight" | "secondary" | "muted" | "border" | "xpBlue" | "challengeOrange" | "rewardGold" | "secondaryHover";

}

export function Button({ title, bgColor, ...rest }: ButtonProps) {
  return (
    <ButtonContainer bgColor={bgColor} {...rest}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
}
