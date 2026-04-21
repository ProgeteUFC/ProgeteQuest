import React from 'react';
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
  Estrelas
} from './styles';

import starIcon from "../../assets/icons/star-icon.svg";
import planetOrange from "../../assets/planet_orange.png";


const VisualizandoTurmasProfessor = () => {
  const { turmaId } = useParams();

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
    <Container>
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
      <Footer />
      <PlanetImage src={planetOrange} alt="Planeta Laranja" />
      </Content>
    </Container>
  );
};

export default VisualizandoTurmasProfessor;
//teste