import React from "react";
import Footer from "../../components/Footer";
import { Pesquisa } from "./styles";
import { Content } from "./styles";
import { Container } from "./styles";
import { Title } from "./styles";
import { Image } from "./styles";
import planet_blue from "../../assets/planet_blue_anel.png";
import { SlArrowRightCircle } from "react-icons/sl";
import { SearchContainer } from "./styles";
import { IconeBusca } from "./styles";
import { Text } from "./styles";
import Header from "../../components/Header";

const EntraEmTurma = () => {
  return (
    <>
      <Container>
        <Header />
        <Content>
          <Title>Entrar em uma turma</Title>
          <Text>
            Para poder entrar em uma turma digite o codigo fornecido pelo
            professor(a)
          </Text>
          <SearchContainer>
            <Pesquisa placeholder="Código:"></Pesquisa>
            <IconeBusca>
              <SlArrowRightCircle />
            </IconeBusca>
          </SearchContainer>
        </Content>
        <Footer />
        <Image src={planet_blue} alt="Planeta Azul" />
      </Container>
    </>
  );
};

export default EntraEmTurma;
