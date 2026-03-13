import React, { useState } from "react";
import Footer from "../../components/Footer";
import { Pesquisa, Content, Container, Title, Image, Text, SearchContainer, IconeBusca } from "./styles";
import planet_blue from "../../assets/planet_blue_anel.png";
import { SlArrowRightCircle } from "react-icons/sl";
import Header from "../../components/Header";
import { alunoService } from "../../services/alunoService";

const EntraEmTurma = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleEntrarTurma() {
    setErro("");
    setSucesso("");
    try {
      const token = localStorage.getItem("token") || "";
      const studentId = localStorage.getItem("userId") || "";
      await alunoService.entrarEmTurma(studentId, codigo, token);
      setSucesso("Você entrou na turma com sucesso!");
      setCodigo("");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
          "Erro ao entrar na turma. Verifique o código."
      );
    }
  }

  return (
    <>
      <Container>
        <Header />
        <Content>
          <Title>Entrar em uma turma</Title>
          <Text>
            Para poder entrar em uma turma digite o código fornecido pelo
            professor(a)
          </Text>
          <SearchContainer>
            <Pesquisa
              placeholder="Código:"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <IconeBusca onClick={handleEntrarTurma}>
              <SlArrowRightCircle />
            </IconeBusca>
          </SearchContainer>
          {erro && <div style={{ color: "red", marginTop: 8 }}>{erro}</div>}
          {sucesso && (
            <div style={{ color: "green", marginTop: 8 }}>{sucesso}</div>
          )}
        </Content>
        <Footer />
        <Image src={planet_blue} alt="Planeta Azul" />
      </Container>
    </>
  );
};

export default EntraEmTurma;
