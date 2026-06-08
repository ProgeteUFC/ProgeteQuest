import React, { useState, useEffect } from 'react';
import HeaderProfessor from '../../components/HeaderProfessor';
import Footer from '../../components/Footer';
import {
  Container,
  Content,
  Title,
  FormCard,
  LeftColumn,
  RightColumn,
  TypeRow,
  Label,
  TypeButtonGroup,
  TypeButton,
  InputItem,
  TextAreaItem,
  SubmitButton,
  PlanetImage,
  NoScroll
} from './styles';

import planetOrange from "../../assets/planet_orange.png";

const CriarAtividade = () => {
  const [tipoAtividade, setTipoAtividade] = useState('');

  // Lógica de resize mantida do seu arquivo anterior para manter o padrão de visualização
  useEffect(() => {
    function hideElementsOnSpecificSizes() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const planet = document.querySelector('[data-hide-planet]') as HTMLElement | null;
      
      const shouldHide =
        (w === 1024 && h === 874) ||
        (w === 768 && h === 874) ||
        (w === 425 && h === 874);
        
      if (planet) {
        if (shouldHide) {
          planet.style.display = 'none';
        } else {
          planet.style.display = '';
        }
      }
    }
    
    hideElementsOnSpecificSizes();
    window.addEventListener('resize', hideElementsOnSpecificSizes);
    return () => window.removeEventListener('resize', hideElementsOnSpecificSizes);
  }, []);

  const handleTipoClick = (tipo: string) => {
    setTipoAtividade(tipo);
  };

  return (
    <>
      <NoScroll />
      <Container style={{ minHeight: '100vh', position: 'relative' }}>
        <HeaderProfessor />
        
        <Content>
          <Title>Criar atividade</Title>
          
          <FormCard>
            <LeftColumn>
              <TypeRow>
                <Label>Tipo de atividade:</Label>
                <TypeButtonGroup>
                  <TypeButton 
                    type="button" 
                    className={tipoAtividade === 'Presença' ? 'active' : ''}
                    onClick={() => handleTipoClick('Presença')}
                  >
                    Presença
                  </TypeButton>
                  <TypeButton 
                    type="button" 
                    className={tipoAtividade === 'Atividade' ? 'active' : ''}
                    onClick={() => handleTipoClick('Atividade')}
                  >
                    Atividade
                  </TypeButton>
                  <TypeButton 
                    type="button" 
                    className={tipoAtividade === 'Seminário' ? 'active' : ''}
                    onClick={() => handleTipoClick('Seminário')}
                  >
                    Seminário
                  </TypeButton>
                </TypeButtonGroup>
              </TypeRow>

              <InputItem type="text" placeholder="Nome da atividade:" />
              <InputItem type="text" placeholder="Data de início:" />
              <InputItem type="text" placeholder="Data de finalização:" />
              <InputItem type="text" placeholder="Peso da atividade:" />
            </LeftColumn>

            <RightColumn>
              <TextAreaItem placeholder="Descrição:" />
              <SubmitButton type="button">CRIAR</SubmitButton>
            </RightColumn>
          </FormCard>

          <PlanetImage src={planetOrange} alt="Planeta Laranja" data-hide-planet />
        </Content>

        <div style={{ width: '100%', position: 'fixed', left: 0, bottom: 0, zIndex: 20 }}>
          <Footer />
        </div>
      </Container>
    </>
  );
};

export default CriarAtividade;