import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { AlunoRanking } from "../../components/AlunoRanking";
import {
  Pagina,
  TituloPagina,
  SubTituloPagina,
  LogoProgete,
  PageContent,
  PlanetaAzulClaro,
  InfosProfessor,
  NomeProfessor,
  ContatoProfessor,
  QuantAlunos,
  QuantAlunosValor,
  ProfessorEturma,
  AcoesEturma,
  OpcoesTurma,
  VizualizarAtividades,
  VizualizarMembros,
  ColocacaoAluno,
  ColocacaoTexto,
  RankingAlunos,
  Estrelas,
  PageState,
  ModalOverlay,
  MembersModal,
  ModalHeader,
  CloseModalButton,
  MembersList,
  MemberItem,
  EmptyMembers,
} from "./style";
import ProgetePng from "../../assets/progete.png";
import ProgeteAzulClaro from "../../assets/planet_blue_anel.png";
import userIcon from "../../assets/icons/user-icon.svg";
import peopleGroup from "../../assets/icons/people-group-icon.svg";
import medalIcon from "../../assets/icons/medal-icon.svg";
import starIcon from "../../assets/icons/star-icon.svg";
import { alunoService } from "../../services/alunoService";

export default function DetalhesDaTurma() {
  const navigate = useNavigate();
  const { id } = useParams(); // id da turma

  const [turma, setTurma] = useState<any>(null);
  const [professor, setProfessor] = useState<any>(null);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [atividades, setAtividades] = useState<any[]>([]);
  const [minhaPosicao, setMinhaPosicao] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (!mostrarMembros) return;

    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setMostrarMembros(false);
    }

    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [mostrarMembros]);

  useEffect(() => {
    async function fetchDados() {
      try {
        const token = localStorage.getItem("token") || "";

        // Buscar turma
        const turmaRes = await alunoService.buscarTurma(id!, token);
        setTurma(turmaRes.data);

        // Buscar professor
        if (turmaRes.data.teacherId) {
          const profRes = await alunoService.buscarProfessor(turmaRes.data.teacherId, token);
          setProfessor(profRes.data);
        }

        // Buscar participantes
        const partRes = await alunoService.listarParticipantesTurma(id!, token);
        setParticipantes(partRes.data);

        // Buscar ranking
        const rankingRes = await alunoService.ranking(id!, token);
        setRanking(rankingRes.data);

        // Buscar atividades
        const atividadesRes = await alunoService.listarAtividades(id!, token);
        console.log("atividadesRes.data", atividadesRes.data);
        setAtividades(atividadesRes.data);

        // Descobrir posição do aluno logado
        const pos = rankingRes.data.findIndex((r: any) => r.studentId === userId);
        setMinhaPosicao(pos >= 0 ? pos + 1 : null);
      } catch (err: any) {
        setErro("Erro ao buscar informações da turma.");
      }
    }
    fetchDados();
  }, [id, userId]);

  return (
    <Pagina>
        <Header />
        <TituloPagina>{turma?.name || "Turma"}</TituloPagina>
        <SubTituloPagina>
          Aqui você visualiza suas atividades e informações <br />
          sobre a turma.
        </SubTituloPagina>
        <LogoProgete src={ProgetePng} alt="Logo Progete" />
        <PlanetaAzulClaro src={ProgeteAzulClaro} alt="" />
        <PageContent>
          {erro && <PageState $error>{erro}</PageState>}
          <ProfessorEturma>
            <InfosProfessor>
              <img src={userIcon} width={60} alt="Ícone de perfil" />
              <div>
                <NomeProfessor>
                  <strong>Professor(a):</strong>{" "}
                  {professor?.name || "Carregando..."}
                </NomeProfessor>
                <ContatoProfessor>
                  <strong>Contato:</strong>{" "}
                  {professor?.email || "Carregando..."}
                </ContatoProfessor>
              </div>
            </InfosProfessor>
            <QuantAlunos>
              <img
                src={peopleGroup}
                width={60}
                alt="Ícone de grupo de pessoas"
              />
              <QuantAlunosValor>
                Alunos na turma: {participantes.length}
              </QuantAlunosValor>
            </QuantAlunos>
          </ProfessorEturma>
          <AcoesEturma>
            <OpcoesTurma>
              <VizualizarAtividades
                type="button"
                onClick={() => navigate(`/minhasAtividades?turma=${id}`)}
              >
                Visualizar atividades
              </VizualizarAtividades>
              <VizualizarMembros
                type="button"
                onClick={() => setMostrarMembros(true)}
              >
                Visualizar membros
              </VizualizarMembros>
            </OpcoesTurma>
            <ColocacaoAluno>
              <img src={medalIcon} width={60} alt="Ícone de medalha" />
              <ColocacaoTexto>
                {minhaPosicao
                  ? `Até o momento, você está em ${minhaPosicao}º lugar nessa turma.`
                  : "Você ainda não está no ranking desta turma."}
              </ColocacaoTexto>
            </ColocacaoAluno>
          </AcoesEturma>
          <RankingAlunos>
            <Estrelas>
              <img src={starIcon} width={30} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={60} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={30} alt="icone de estrela" />
            </Estrelas>
            {ranking.slice(0, 4).map((aluno, idx) => (
              <AlunoRanking
                key={aluno.studentId}
                posicaoAluno={idx + 1}
                nomeAluno={aluno.name || "Aluno sem nome"}
                pontuacao={aluno.points || 0}
              />
            ))}
            {ranking.length === 0 && (
              <PageState>Ainda não há alunos no ranking.</PageState>
            )}
          </RankingAlunos>
        </PageContent>

        {mostrarMembros && (
          <ModalOverlay onMouseDown={() => setMostrarMembros(false)}>
            <MembersModal
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-lista-membros"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <ModalHeader>
                <div>
                  <h2 id="titulo-lista-membros">Alunos matriculados</h2>
                  <p>{participantes.length} aluno(s) na turma</p>
                </div>
                <CloseModalButton
                  type="button"
                  aria-label="Fechar lista de alunos"
                  onClick={() => setMostrarMembros(false)}
                >
                  ×
                </CloseModalButton>
              </ModalHeader>

              {participantes.length > 0 ? (
                <MembersList>
                  {participantes.map((participante) => (
                    <MemberItem key={participante.studentId}>
                      <span aria-hidden="true">
                        {participante.name?.charAt(0).toUpperCase() || "A"}
                      </span>
                      <div>
                        <strong>{participante.name}</strong>
                        <p>Matrícula: {participante.registrationStudent}</p>
                        {participante.email && <p>{participante.email}</p>}
                      </div>
                    </MemberItem>
                  ))}
                </MembersList>
              ) : (
                <EmptyMembers>Nenhum aluno matriculado nesta turma.</EmptyMembers>
              )}
            </MembersModal>
          </ModalOverlay>
        )}
    </Pagina>
  );
}
