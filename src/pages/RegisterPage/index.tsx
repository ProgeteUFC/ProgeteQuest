import React from "react";
import {Container, FormGroup, Register} from "./style"
import { Button } from "../../components/Button";
import { TitleName } from "../../components/TitleName";

export default function RegisterPage(){
  return (
    <Container>
       <Register>

        <div className="toggle-buttons">
           <TitleName titleName="Criar Conta" />
        </div>

        <form>
          <FormGroup>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              required
              />
          </FormGroup>
          <FormGroup>
            <input
              type="password"
              placeholder="Senha"
              name="senha"
              required
              />
          </FormGroup>
          <Button title="Registrar" />
        </form>
      </Register>
    </Container>
  );
};
