import HeaderProfessor from '../../components/HeaderProfessor';


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
  PlanetOrange,
  PageWrapper,
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
  return (
    <PageWrapper>
      <HeaderProfessor />
      <ViewClassesBg>
        <ViewClassesContainer>
          <Title>Visualizar turmas</Title>
          <Subtitle>Aqui você visualiza as turmas criadas por você.</Subtitle>
          <ListaTurmas>
            <ListaTurmasScroll>
              {classes.map((className) => (
                <TurmaCard tabIndex={0} key={className}>
                  <TurmaNome>{className}</TurmaNome>
                </TurmaCard>
              ))}
            </ListaTurmasScroll>
          </ListaTurmas>
        </ViewClassesContainer>
        <PlanetOrange src={planetOrange} alt="Planeta Laranja" />
        <Footer />
      </ViewClassesBg>
    </PageWrapper>
  );
};

export default ViewClasses;
