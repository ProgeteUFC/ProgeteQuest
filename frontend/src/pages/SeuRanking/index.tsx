import Footer from "../../components/Footer";
import { HeaderRanking } from "../../components/headerRanking";
import { MenuRanking } from "../../components/MenuRanking";
import { Ranking } from "../../components/Ranking";
import { Content } from "../suasDisciplinas/styles";
import { Container } from "./styles";
import { Title } from "./styles";

const SeuRanking = () => {
  return (
    <>
      <Container>
        <HeaderRanking />
        <Content>
          <Title>Olá, Pedro Braga!</Title>
          <MenuRanking />
          <Title>Seu Ranking</Title>
          <Ranking />
        </Content>
        <Footer />
      </Container>
    </>
  );
};

export default SeuRanking;
