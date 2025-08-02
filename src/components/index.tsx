import React from "react";
import { Container , Login, LoginCard, FormGroup, AboutUs} from "./style";
import  logo from "../../assets/logo.png";
import progete from "../../assets/progete.png";
import planetOrange from "../../assets/planet_orange.png";
import {Button} from "../../components/Button";

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
            <Button title="Entrar" />
          </FormGroup>
        </LoginCard>
      </Login>

      <AboutUs>        
        <h1>Bem-vindo(a) ao</h1>
        <img className="logo-image" src={logo} alt="Logo" />
        <img className="planet-image" src={planetOrange} alt="Planeta Laranja" />
         <h1>Desafie, Supere e Vença!</h1>
        <p>
          ProgeteQuest é o sistema de Gamificação acadêmica<br/> 
          desenvolvido por alunos da UFC Campus de Russas! <br/>
          Aqui, os professores lançam desafios e os alunos <br/>
          conquistam pontos extras nas disciplinas. <br/>
          Aprender nunca foi tão divertido!
        </p>
      </AboutUs>
    </Container>
  );
}
