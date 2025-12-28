import { Button } from "../Button";
import { Content } from "./styles";
import { Link } from "react-router-dom";
import { Menu } from "../Menu";
import React from "react";

export function ConteinerMenu() {
  return (
    <>
      <Content>
        <Menu />
      </Content>
    </>
  );
}
