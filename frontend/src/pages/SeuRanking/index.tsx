import Footer from "../../components/Footer";
import { HeaderRanking } from "../../components/headerRanking";
import { MenuRanking } from "../../components/MenuRanking";
import { Ranking } from "../../components/Ranking";
import { Content } from "../SeuRanking/styles";
import { Container } from "./styles";
import { Title } from "./styles";
import { Image } from "./styles"
import planet_blue from "../../assets/planet_blue_anel.png";


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
        <Image
        src={planet_blue}
        alt="Planeta Azul"
        />
      </Container>
    </>
  );
};

export default SeuRanking;
