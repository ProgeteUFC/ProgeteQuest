import HeaderProfessor from '../../components/HeaderProfessor';
import HeaderAdmin from '../../components/HeaderAdmin';
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
  ProfessorNome,
  PlanetOrange,
  LogoProgete,
  StateMessage,
  CreateClassLink,
} from './styles';

import planetOrange from '../../assets/planet_orange.png';
import progeteLogo from '../../assets/progete.png';
import { turmaService, TurmaProfessor } from '../../services/turmaService';


const ViewClasses = ({ embedded = false, teacherId }: { embedded?: boolean; teacherId?: string }) => {
  const isAdmin = localStorage.getItem('userType') === 'admin';
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
        if (ativo) setTurmas(teacherId ? response.data.filter((turma) => turma.teacherId === teacherId) : response.data);
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
  }, [teacherId]);

  const handleCardClick = (id: string) => {
  // Navega para a rota definida no App.tsx passando o ID da turma
  navigate(isAdmin ? `/admin/classes/${id}` : `/visualizandoTurmasProfessor/${id}`);
  };

  return (
    <ViewClassesBg>
      {!embedded && (isAdmin ? <HeaderAdmin /> : <HeaderProfessor />)}
      <ViewClassesContainer>
        <Title>{isAdmin ? (teacherId ? "Turmas do professor" : "Gerenciar turmas") : "Visualizar turmas"}</Title>
        <Subtitle>{isAdmin ? (teacherId ? "Turmas vinculadas ao professor selecionado." : "Gerencie as turmas e seus professores responsáveis.") : "Aqui você visualiza as turmas criadas por você."}</Subtitle>
        <CreateClassLink to={isAdmin ? '/admin/classes/new' : '/cadastrarDisciplina'}>Criar turma</CreateClassLink>
        <ListaTurmas>
          <ListaTurmasScroll>
            {carregando && <StateMessage>Carregando turmas...</StateMessage>}
            {!carregando && erro && <StateMessage $error>{erro}</StateMessage>}
            {!carregando && !erro && turmas.length === 0 && (
              <StateMessage>Nenhuma turma encontrada.</StateMessage>
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
                {isAdmin && <ProfessorNome>Professor: {turma.teacher?.user?.name || turma.teacherId}</ProfessorNome>}
              </TurmaCard>
            ))}
          </ListaTurmasScroll>
        </ListaTurmas>
      </ViewClassesContainer>
      {!embedded && <LogoProgete src={progeteLogo} alt="Progete" />}
      <PlanetOrange src={planetOrange} alt="" />
    </ViewClassesBg>
  );
};

export default ViewClasses;
