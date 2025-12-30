import React from "react";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import { DataProfile } from "../../components/DataProfile";
import {
  Content,
  Container,
  // ButtonWrapper,
  LogoContainer,
  SaveButton,
} from "./styles";
import { Button } from "../../components/Button";
import lua from "../../assets/planet_orange.png";
import logo from "../../assets/image.png";
import { useState } from "react";
import Header from "../../components/Header";

export default function MeusDados() {
  const [userData, setUserData] = useState({
    nome: "",
    curso: "",
    matricula: "",
    email: "",
    senha: "",
    confirmasenha: "",
  });

  const handleDataChange = (field: keyof typeof userData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Dados salvos:", userData);
    alert("Dados salvos com sucesso!");
  };

  return (
    <>
      <Header />

      <Content className="meusDados">
        <TitleName titleName="Dados Pessoais" />
        <TitleDescription
          titleDescription="Aqui você pode visualizar e editar
            seus dados pessoais."
        />

        <Container>
          <DataProfile
            title="Nome:"
            value={userData.nome}
            onValueChange={(value) => handleDataChange("nome", value)}
          />

          <DataProfile
            title="Curso:"
            value={userData.curso}
            onValueChange={(value) => handleDataChange("curso", value)}
          />

          <DataProfile
            title="Matrícula:"
            value={userData.matricula}
            onValueChange={(value) => handleDataChange("matricula", value)}
          />

          <DataProfile
            title="Email:"
            value={userData.email}
            type="email"
            onValueChange={(value) => handleDataChange("email", value)}
          />

          <DataProfile
            title="Senha:"
            value={userData.senha}
            type="password"
            onValueChange={(value) => handleDataChange("senha", value)}
          />

          <DataProfile
            title="Repita sua senha:"
            value={userData.confirmasenha}
            type="password"
            onValueChange={(value) => handleDataChange("confirmasenha", value)}
          />
        </Container>

        <SaveButton onClick={handleSave}>SALVAR</SaveButton>

        <LogoContainer>
          <img src={logo} alt="Progete Logo" className="logo" />
        </LogoContainer>

        <img src={lua} alt="planet" className="planet-image" />
      </Content>
    </>
  );
}
