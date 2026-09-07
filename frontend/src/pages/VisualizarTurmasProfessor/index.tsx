import HeaderProfessor from '../../components/HeaderProfessor';
import { useNavigate } from 'react-router-dom';

import React from 'react';
import {
  ViewClassesBg,
  ViewClassesContainer,
  Title,
  Subtitle,
  ListaTurmas,
  ListaTurmasScroll,
  TurmaCard,
  TurmaNome,
  PlanetOrange
} from './styles';

import planetOrange from '../../assets/planet_orange.png';
import Footer from '../../components/Footer';

const classes = [
  'Requisitos de Software',
  'Ética e Legislação',
  'Empreendedorismo',
  'Gerência de Projetos',
  'Matemática Discreta',
];


const ViewClasses = () => {

  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
  // Navega para a rota definida no App.tsx passando o ID da turma
  navigate(`/visualizandoTurmasProfessor/${id}`);
  };

  return (
    <>
      <HeaderProfessor />
      <ViewClassesBg>
        <ViewClassesContainer>
          <Title>Visualizar turmas</Title>
          <Subtitle>Aqui você visualiza as turmas criadas por você.</Subtitle>
          <ListaTurmas>
            <ListaTurmasScroll>
              {classes.map((className) => (
                <TurmaCard tabIndex={0} key={className} onClick={() => handleCardClick(className)}>
                  <TurmaNome>{className}</TurmaNome>
                </TurmaCard>
              ))}
            </ListaTurmasScroll>
          </ListaTurmas>
        </ViewClassesContainer>
        <PlanetOrange src={planetOrange} alt="Planeta Laranja" />
        <Footer />
      </ViewClassesBg>
    </>
  );
};

export default ViewClasses;
