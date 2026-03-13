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
  OpcoesTurma,
  VizualizarAtividades,
  VizualizarMembros,
  ColocacaoAluno,
  ColocacaoTexto,
  RankingAlunos,
  Estrelas,
} from "./style";
import ProgetePng from "../../assets/progete.png";
import ProgeteAzulClaro from "../../assets/planeta-azul-claro.png";
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
  const userId = localStorage.getItem("userId") || "";

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
    <>
      <Header />
      <Pagina>
        <TituloPagina>{turma?.name || "Turma"}</TituloPagina>
        <SubTituloPagina>
          Aqui você visualiza suas atividades e informações <br />
          sobre a turma.
        </SubTituloPagina>
        <LogoProgete src={ProgetePng} alt="Logo Progete" />
        <PlanetaAzulClaro src={ProgeteAzulClaro} alt="" />
        <PageContent>
          <ProfessorEturma>
            <InfosProfessor>
              <img src={userIcon} width={60} alt="Ícone de perfil" />
              <div>
                <NomeProfessor>
                  Professor(a): {professor?.name || "Carregando..."}
                </NomeProfessor>
                <ContatoProfessor>
                  Contato: {professor?.email || "Carregando..."}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <OpcoesTurma>
              <VizualizarAtividades
                onClick={() => navigate(`/minhasAtividades?turma=${id}`)}
              >
                Visualizar atividades
              </VizualizarAtividades>
              <VizualizarMembros
                onClick={() =>
                  alert(
                    participantes
                      .map((p) => `${p.name} (${p.registrationStudent})`)
                      .join("\n") || "Nenhum membro encontrado"
                  )
                }
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
          </div>
          <RankingAlunos>
            <Estrelas>
              <img src={starIcon} width={30} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={60} alt="icone de estrela" />
              <img src={starIcon} width={40} alt="icone de estrela" />
              <img src={starIcon} width={30} alt="icone de estrela" />
            </Estrelas>
            {ranking.slice(0, 5).map((aluno, idx) => (
              <AlunoRanking
                key={aluno.studentId}
                posicaoAluno={idx + 1}
                nomeAluno={aluno.name}
              />
            ))}
          </RankingAlunos>
        </PageContent>
      </Pagina>
    </>
  );
}
