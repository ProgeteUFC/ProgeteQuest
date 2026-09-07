import HeaderProfessor from '../../components/HeaderProfessor';
import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
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
  LogoProgete,
  StateMessage,
} from './styles';

import planetOrange from '../../assets/planet_orange.png';
import progeteLogo from '../../assets/progete.png';
import { turmaService, TurmaProfessor } from '../../services/turmaService';


const ViewClasses = () => {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<TurmaProfessor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarTurmas() {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await turmaService.listarTurmasProfessor(token);
        if (ativo) setTurmas(response.data);
      } catch (error: any) {
        if (ativo) {
          setErro(error?.response?.data?.message || 'Não foi possível carregar suas turmas.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarTurmas();
    return () => { ativo = false; };
  }, []);

  const handleCardClick = (id: string) => {
  // Navega para a rota definida no App.tsx passando o ID da turma
  navigate(`/visualizandoTurmasProfessor/${id}`);
  };

  return (
    <ViewClassesBg>
      <HeaderProfessor />
      <ViewClassesContainer>
        <Title>Visualizar turmas</Title>
        <Subtitle>Aqui você visualiza as turmas criadas por você.</Subtitle>
        <ListaTurmas>
          <ListaTurmasScroll>
            {carregando && <StateMessage>Carregando turmas...</StateMessage>}
            {!carregando && erro && <StateMessage $error>{erro}</StateMessage>}
            {!carregando && !erro && turmas.length === 0 && (
              <StateMessage>Você ainda não criou nenhuma turma.</StateMessage>
            )}
            {!carregando && !erro && turmas.map((turma) => (
              <TurmaCard
                role="button"
                tabIndex={0}
                key={turma.classId}
                onClick={() => handleCardClick(turma.classId)}
                onKeyDown={(event) => event.key === 'Enter' && handleCardClick(turma.classId)}
              >
                <TurmaNome>{turma.name}</TurmaNome>
              </TurmaCard>
            ))}
          </ListaTurmasScroll>
        </ListaTurmas>
      </ViewClassesContainer>
      <LogoProgete src={progeteLogo} alt="Progete" />
      <PlanetOrange src={planetOrange} alt="" />
    </ViewClassesBg>
  );
};

export default ViewClasses;
