import React from "react";
import { Button } from "../Button";
import { Container } from "./styles";
import { Link } from "react-router-dom";

export function Menu() {
  return (
    <Container>
      <Button title={"Cadastrar Disciplinas"} />
      <Button title={"Disciplinas"} />
      <Button title={"Meus Dados"} />
      <Button title={"Fórum"} />
    </Container>
  );
}
