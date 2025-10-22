import React from "react";
import { Container , Login, LoginCard, FormGroup, AboutUs} from "./style";
import  logo from "../../assets/logo.png";
import progete from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import {Button} from "../../components/Button";
import { TitleName } from "../../components/TitleName";
import { TitleDescription } from "../../components/TitleDescription";

export default function LoginPage() {
 
  return (
    <Container>
      <Login>
        <img src={progete} alt="progete" />
        <LoginCard>
          <Button title="Sou aluno" />
          <Button title="Sou professor" />
          <FormGroup>
            <input type="text" name="usuario" placeholder="Email" required />
            <input type="password" name="senha" placeholder="Senha" required />
            <a href="">Esqueci minha senha</a>
            <a href="/register">Registre-se</a>
            <Button title="Entrar" />
          </FormGroup>
        </LoginCard>
      </Login>

      <AboutUs>
        <div className="about-content">
          <div className="about-header">
            <TitleName titleName="Bem-vindo(a) ao ProgeteQuest!" />
            <img className="planet-image" src={planetOrange} alt="Planeta Laranja" />
          </div>

          <img className="logo-image" src={logo} alt="Logo" />
          <TitleName titleName="Desafie, Supere e Vença!" />
          <TitleDescription titleDescription="ProgeteQuest é o sistema de Gamificação acadêmica desenvolvido por alunos da UFC Campus de Russas! 
                        Aqui, os professores lançam desafios e os alunos conquistam pontos extras nas disciplinas. Aprender nunca foi tão divertido!" />
        </div>

      </AboutUs>
    </Container>
  );
}
