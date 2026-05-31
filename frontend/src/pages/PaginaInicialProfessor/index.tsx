import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer'
import HeaderProfessor from '../../components/HeaderProfessor'
import { TitleName } from '../../components/TitleName'
import { Container, Content, MenuContainer, MenuOption, MenuOptions, PlanetImage, DescriptionContainer, DescriptionText} from './styles'
import { Link } from 'react-router-dom' 
import planetOrange from "../../assets/planet_orange.png";
import { Menu } from 'components/Menu'
import astronaut from "../../assets/astronaut.png";
import { AstronautImage } from "./styles";

const PaginaInicialProfessor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

return (
  <>
    <PlanetImage src={planetOrange} alt="Planeta Laranja" />
    <AstronautImage src={astronaut} alt="Astronauta" />
    <Container>
      <HeaderProfessor />

      <Content>
        <TitleName titleName="Olá, Professor! O que você deseja fazer ?" />

        <MenuContainer>
          <MenuOptions>
            <MenuOption as={Link} to="/entrarEmTurma">
              Criar Turma
            </MenuOption>

            <MenuOption as={Link} to="/minhasTurmas">
              Visualizar Turmas
            </MenuOption>

            <MenuOption as={Link} to="/meusDados">
              Meus dados
            </MenuOption>

            <MenuOption as={Link} to="/forum">
              Fórum
            </MenuOption>
          </MenuOptions>
        </MenuContainer>

        <DescriptionContainer>
          <DescriptionText style={{ fontWeight: "bold" }}>
            Gerencie suas turmas e crie desafios interativos de forma simples e rápida.
          </DescriptionText>

          <DescriptionText style={{ fontWeight: "bold" }}>
            A ferramenta que você precisava para conectar o conteúdo ao coração dos seus alunos.
          </DescriptionText>
        </DescriptionContainer>
      </Content>

      <Footer />
    </Container>
  </>
);
}

export default PaginaInicialProfessor