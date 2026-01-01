import React from "react";
import { Container, ActivityTitle, Title, ActivityData, Data } from "./styles";

interface ActivityProps {
  title: string;
  start: string;
  end: string;
}

export function Activity({ title, start, end, ...rest }: ActivityProps) {
  return (
    <Container>
      <ActivityTitle {...rest}>
        <Title>{title}</Title>
      </ActivityTitle>
      <ActivityData>
        <Data>
          Inicio:{start}
          Finaliza em: {end}
        </Data>
      </ActivityData>
    </Container>
  );
}
