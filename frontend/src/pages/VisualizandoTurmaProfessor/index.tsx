import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderProfessor from '../../components/HeaderProfessor';
import Footer from '../../components/Footer';
import { 
  Container, 
  Content, 
  HeaderInfo, 
  DashboardGrid, 
  ActionCard, 
  ActionButton, 
  RankingCard, 
  RankingItem,
  PlanetImage,
  AstronautImage,
  Estrelas,
  NoScroll
} from './styles';


import starIcon from "../../assets/icons/star-icon.svg";
import planetOrange from "../../assets/planet_orange.png";
import astronaut from "../../assets/astronaut.png";


const VisualizandoTurmasProfessor = () => {
  const { turmaId } = useParams();

  useEffect(() => {
    function hideElementsOnSpecificSizes() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const planet = document.querySelector('[data-hide-planet]') as HTMLElement | null;
      const astronaut = document.querySelector('[data-hide-astronaut]') as HTMLElement | null;
      const shouldHide =
        (w === 1024 && h === 874) ||
        (w === 768 && h === 874) ||
        (w === 425 && h === 874);
      if (planet) {
        if (shouldHide) {
          planet.style.display = 'none';
          console.log('Planeta ocultado via JS em', w, 'x', h);
        } else {
          planet.style.display = '';
        }
      }
      if (astronaut) {
        if (shouldHide) {
          astronaut.style.display = 'none';
          console.log('Astronauta ocultado via JS em', w, 'x', h);
        } else {
          astronaut.style.display = '';
        }
      }
      console.log('Tamanho da janela:', w, 'x', h, '| shouldHide:', shouldHide);
    }
    hideElementsOnSpecificSizes();
    window.addEventListener('resize', hideElementsOnSpecificSizes);
    return () => window.removeEventListener('resize', hideElementsOnSpecificSizes);
  }, []);

  // Dados mockados para o protótipo. 
  // Futuramente, isso virá de um fetch usando o turmaId.
  const ranking = [
    { posicao: '1º', nome: 'Usuário A' },
    { posicao: '2º', nome: 'Usuário X' },
    { posicao: '3º', nome: 'Usuário C' },
    { posicao: '4º', nome: 'Usuário M' },
    { posicao: '5º', nome: 'Usuário S' },
  ];

  return (
    <>
      <NoScroll />
      <Container style={{ minHeight: '100vh', position: 'relative' }}>
        <HeaderProfessor />
        <Content>
          <HeaderInfo>
            {/* O nome da turma viria do back-end. Deixei fixo como no protótipo */}
            <h1>{turmaId}</h1>
            <p>Aqui você gerencia sua turma e visualiza informações importantes.</p>
          </HeaderInfo>
          <DashboardGrid>
            {/* Painel de Ações */}
            <ActionCard>
              <ActionButton>Criar avaliação</ActionButton>
              <ActionButton>Visualizar avaliações</ActionButton>
              <ActionButton>Matricular aluno</ActionButton>
              <ActionButton>Visualizar alunos</ActionButton>
              <ActionButton>Gerar JoinCode</ActionButton>
              <ActionButton>Excluir turma</ActionButton>
            </ActionCard>
            {/* Painel de Ranking */}
            <RankingCard>
              <Estrelas>
                <img src={starIcon} width={30} alt="icone de estrela" />
                <img src={starIcon} width={40} alt="icone de estrela" />
                <img src={starIcon} width={60} alt="icone de estrela" />
                <img src={starIcon} width={40} alt="icone de estrela" />
                <img src={starIcon} width={30} alt="icone de estrela" />
              </Estrelas>
              {ranking.map((item, index) => (
                <RankingItem key={index}>
                  <div className="badge">{item.posicao}</div>
                  <span className="name">{item.nome}</span>
                </RankingItem>
              ))}
            </RankingCard>
          </DashboardGrid>
          <PlanetImage src={planetOrange} alt="Planeta Laranja" data-hide-planet />
          <AstronautImage src={astronaut} alt="Astronauta" data-hide-astronaut />
        </Content>
        <div style={{ width: '100%', position: 'fixed', left: 0, bottom: 0, zIndex: 20 }}>
          <Footer />
        </div>
      </Container>
    </>
  );
};

export default VisualizandoTurmasProfessor;