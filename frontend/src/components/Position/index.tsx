import React from "react";
import {
  Atividade,
  Container,
  Number,
  NumberAndSuffix,
  Suffix,
} from "./styles";

interface PositionProps {
  atividade: string;
  number: string | number;
  suffix?: string;
}
export function Position({
  atividade,
  number,
  suffix,
  ...rest
}: PositionProps) {
  return (
    <>
      <Container {...rest}>
        <Atividade>{atividade}</Atividade>
        <NumberAndSuffix>
          <Number>{number}</Number>
          <Suffix>{suffix}</Suffix>
        </NumberAndSuffix>
      </Container>
    </>
  );
}
