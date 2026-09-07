import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderProfessor from "../../components/HeaderProfessor";
import Footer from "../../components/Footer";
import { turmaService, TurmaProfessor, ParticipanteTurma, AtividadeTurma, EntregaAtividade, CodigoAtividade } from "../../services/turmaService";
import {
  Container, Content, HeaderInfo, DashboardGrid, ActionCard, ActionButton,
  RankingCard, RankingItem, Estrelas, NoScroll, Feedback, ModalBackdrop,
  ModalCard, ModalActions, CancelButton, ConfirmButton, DangerButton, DataList, FormField,
} from "./styles";
import starIcon from "../../assets/icons/star-icon.svg";

type ModalType = "createActivity" | "activities" | "enroll" | "students" | "joinCode" | "delete" | null;

const VisualizandoTurmasProfessor = () => {
  const { turmaId } = useParams<{ turmaId: string }>();
  const navigate = useNavigate();
  const [turma, setTurma] = useState<TurmaProfessor | null>(null);
  const [ranking, setRanking] = useState<ParticipanteTurma[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [atividades, setAtividades] = useState<AtividadeTurma[]>([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<AtividadeTurma | null>(null);
  const [entregas, setEntregas] = useState<EntregaAtividade[]>([]);
  const [atividadeCodigo, setAtividadeCodigo] = useState<AtividadeTurma | null>(null);
  const [codigosAtividade, setCodigosAtividade] = useState<CodigoAtividade[]>([]);
  const [dataAtividade, setDataAtividade] = useState("");
  const [tipoAtividade, setTipoAtividade] = useState<AtividadeTurma["type"]>("activity");
  const [participantes, setParticipantes] = useState<ParticipanteTurma[]>([]);
  const [valor, setValor] = useState("");
  const [feedback, setFeedback] = useState("");
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!turmaId) return;
    async function carregar() {
      try {
        const [turmaResponse, rankingResponse] = await Promise.all([
          turmaService.buscarTurma(turmaId!, token),
          turmaService.buscarRanking(turmaId!, token).catch(() => ({ data: [] as ParticipanteTurma[] })),
        ]);
        setTurma(turmaResponse.data);
        setRanking(rankingResponse.data);
      } catch (error: any) {
        setErro(error?.response?.data?.message || "Não foi possível carregar a turma.");
      }
    }
    carregar();
  }, [turmaId, token]);

  function abrirModal(tipo: ModalType) {
    setValor("");
    setDataAtividade("");
    setTipoAtividade("activity");
    setAtividadeSelecionada(null);
    setEntregas([]);
    setAtividadeCodigo(null);
    setCodigosAtividade([]);
    setErro("");
    setFeedback("");
    setModal(tipo);
  }

  function fecharModal() {
    if (!processando) setModal(null);
  }

  async function executar(acao: () => Promise<void>) {
    try {
      setProcessando(true);
      setErro("");
      setFeedback("");
      await acao();
    } catch (error: any) {
      setErro(error?.response?.data?.message || "Não foi possível concluir a operação.");
    } finally {
      setProcessando(false);
    }
  }

  async function visualizarAtividades() {
    if (!turmaId) return;
    abrirModal("activities");
    await executar(async () => {
      const response = await turmaService.listarAtividades(turmaId, token);
      setAtividades(response.data);
    });
  }

  async function visualizarAlunos() {
    if (!turmaId) return;
    abrirModal("students");
    await executar(async () => {
      const response = await turmaService.listarParticipantes(turmaId, token);
      setParticipantes(response.data);
    });
  }

  async function visualizarEntregas(atividade: AtividadeTurma) {
    setAtividadeSelecionada(atividade);
    setAtividadeCodigo(null);
    await executar(async () => {
      const response = await turmaService.listarEntregas(atividade.activityId, token);
      setEntregas(response.data);
    });
  }

  async function visualizarCodigosAtividade(atividade: AtividadeTurma) {
    setAtividadeCodigo(atividade);
    setAtividadeSelecionada(null);
    await executar(async () => {
      const response = await turmaService.listarCodigosAtividade(atividade.activityId, token);
      setCodigosAtividade(response.data);
    });
  }

  async function gerarNovoCodigoAtividade() {
    if (!atividadeCodigo) return;
    await executar(async () => {
      const codigoAtivo = codigosAtividade.find((codigo) => codigo.active);
      if (codigoAtivo) {
        await turmaService.renovarCodigoAtividade(codigoAtivo.codeId, token);
      } else {
        await turmaService.criarCodigoAtividade(atividadeCodigo.activityId, atividadeCodigo.date, token);
      }
      const response = await turmaService.listarCodigosAtividade(atividadeCodigo.activityId, token);
      setCodigosAtividade(response.data);
      setFeedback("Novo código de check-in gerado com sucesso!");
    });
  }

  async function prepararCriacaoAtividade() {
    abrirModal("createActivity");
  }

  async function criarAtividade() {
    if (!turmaId || !valor.trim() || !dataAtividade) {
      return setErro("Preencha o nome e a data da atividade.");
    }
    await executar(async () => {
      const response = await turmaService.criarAtividade({
        name: valor.trim(), date: new Date(dataAtividade).toISOString(), type: tipoAtividade,
        classId: turmaId,
      }, token);
      await turmaService.criarCodigoAtividade(response.data.activityId, response.data.date, token);
      setFeedback("Atividade e código de check-in criados com sucesso!");
      setValor("");
      setDataAtividade("");
    });
  }

  async function matricularAluno() {
    if (!turma?.joinCode) return setErro("Gere um JoinCode antes de matricular o aluno.");
    if (!valor.trim()) return setErro("Informe a matrícula do aluno.");
    await executar(async () => {
      await turmaService.matricularAluno(valor.trim(), turma.joinCode!, token);
      setFeedback("Aluno matriculado com sucesso!");
      setValor("");
      const response = await turmaService.buscarRanking(turma.classId, token).catch(() => ({ data: [] }));
      setRanking(response.data);
    });
  }

  function visualizarJoinCode() {
    abrirModal("joinCode");
  }

  async function gerarJoinCode() {
    if (!turmaId) return;
    await executar(async () => {
      const response = await turmaService.regenerarJoinCode(turmaId, token);
      setTurma(response.data);
      setFeedback("Novo código gerado com sucesso!");
    });
  }

  async function excluirTurma() {
    if (!turmaId) return;
    await executar(async () => {
      await turmaService.excluirTurma(turmaId, token);
      navigate("/visualizarTurmasProfessor");
    });
  }

  const modalTitles: Record<Exclude<ModalType, null>, string> = {
    createActivity: "Criar atividade", activities: "Atividades da turma",
    enroll: "Matricular aluno", students: "Alunos matriculados",
    joinCode: "Código de entrada da turma", delete: "Excluir turma?",
  };

  return (
    <>
      <NoScroll />
      <Container>
        <HeaderProfessor />
        <Content>
          <HeaderInfo>
            <h1>{turma?.name || "Carregando turma..."}</h1>
            <p>Aqui você gerencia sua turma e visualiza informações importantes.</p>
            {erro && !modal && <Feedback $error>{erro}</Feedback>}
          </HeaderInfo>
          <DashboardGrid>
            <ActionCard>
              <ActionButton onClick={prepararCriacaoAtividade}>Criar atividade</ActionButton>
              <ActionButton onClick={visualizarAtividades}>Visualizar atividades</ActionButton>
              <ActionButton onClick={() => abrirModal("enroll")}>Matricular aluno</ActionButton>
              <ActionButton onClick={visualizarAlunos}>Visualizar alunos</ActionButton>
              <ActionButton onClick={visualizarJoinCode}>Visualizar código de entrada</ActionButton>
              <ActionButton onClick={() => abrirModal("delete")}>Excluir turma</ActionButton>
            </ActionCard>
            <RankingCard>
              <Estrelas>{[30, 40, 60, 40, 30].map((size, index) => <img key={index} src={starIcon} width={size} alt="" />)}</Estrelas>
              {ranking.length === 0 && <p>Nenhum aluno no ranking.</p>}
              {ranking.slice(0, 5).map((item, index) => (
                <RankingItem key={item.studentId}>
                  <div className="badge">{index + 1}º</div>
                  <span className="name">{item.name}</span>
                </RankingItem>
              ))}
            </RankingCard>
          </DashboardGrid>
        </Content>
        <div style={{ width: "100%", position: "fixed", left: 0, bottom: 0, zIndex: 20 }}><Footer /></div>

        {modal && (
          <ModalBackdrop onMouseDown={(event) => event.target === event.currentTarget && fecharModal()}>
            <ModalCard role="dialog" aria-modal="true" aria-labelledby="modal-title">
              <h2 id="modal-title">{modalTitles[modal]}</h2>
              {modal === "createActivity" && <>
                <FormField>
                  <label htmlFor="activity-name">Nome da atividade</label>
                  <input id="activity-name" autoFocus value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex.: Lista de exercícios" />
                </FormField>
                <FormField>
                  <label htmlFor="activity-deadline">Data limite de entrega</label>
                  <input id="activity-deadline" type="datetime-local" value={dataAtividade} onChange={(e) => setDataAtividade(e.target.value)} />
                  <small>Após esse horário, novas entregas não serão aceitas.</small>
                </FormField>
                <FormField>
                  <label htmlFor="activity-type">Tipo da atividade</label>
                  <select id="activity-type" value={tipoAtividade} onChange={(e) => setTipoAtividade(e.target.value as AtividadeTurma["type"])}>
                    <option value="activity">Atividade</option><option value="seminar">Seminário</option><option value="attendance">Presença</option>
                  </select>
                </FormField>
              </>}
              {modal === "enroll" && <input autoFocus value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Matrícula do aluno" />}
              {modal === "activities" && <DataList>
                {processando && !atividadeSelecionada ? <p>Carregando...</p> : atividades.length ? atividades.map((item) => (
                  <div key={item.activityId}>
                    <strong>{item.name}</strong>
                    <span>Entrega até {new Date(item.date).toLocaleString("pt-BR")}</span>
                    <button type="button" onClick={() => visualizarEntregas(item)}>Ver quem entregou</button>
                    <button type="button" onClick={() => visualizarCodigosAtividade(item)}>Ver códigos de check-in</button>
                  </div>
                )) : <p>Nenhuma atividade criada.</p>}
                {atividadeSelecionada && <div className="deliveries">
                  <strong>Entregas: {atividadeSelecionada.name}</strong>
                  {processando ? <span>Carregando...</span> : entregas.length ? entregas.map((entrega) => (
                    <span key={entrega.checkinId}>{entrega.name} ({entrega.registrationStudent}) — {new Date(entrega.deliveredAt).toLocaleString("pt-BR")}</span>
                  )) : <span>Nenhum aluno entregou esta atividade.</span>}
                </div>}
                {atividadeCodigo && <div className="deliveries">
                  <strong>Códigos: {atividadeCodigo.name}</strong>
                  {processando ? <span>Carregando...</span> : codigosAtividade.length ? codigosAtividade.map((codigo) => (
                    <span key={codigo.codeId}>
                      <b>{codigo.code}</b> — {codigo.active ? "Ativo" : "Inativo"} — válido até {new Date(codigo.validity).toLocaleString("pt-BR")}
                    </span>
                  )) : <span>Nenhum código de check-in foi gerado para esta atividade.</span>}
                  {!processando && <button type="button" onClick={gerarNovoCodigoAtividade}>Gerar novo código</button>}
                </div>}
              </DataList>}
              {modal === "students" && <DataList>{processando ? <p>Carregando...</p> : participantes.length ? participantes.map((item) => <div key={item.studentId}><strong>{item.name}</strong><span>{item.registrationStudent} · {item.email}</span></div>) : <p>Nenhum aluno matriculado.</p>}</DataList>}
              {modal === "joinCode" && <><p>Compartilhe este código para os alunos entrarem na turma:</p><div className="join-code">{processando ? "Gerando..." : turma?.joinCode || "Código indisponível"}</div><p>Gere um novo somente se quiser substituir o código atual.</p></>}
              {modal === "delete" && <p>Essa ação é permanente e removerá a turma.</p>}
              {feedback && <Feedback>{feedback}</Feedback>}
              {erro && <Feedback $error>{erro}</Feedback>}
              <ModalActions>
                <CancelButton onClick={fecharModal} disabled={processando}>Fechar</CancelButton>
                {modal === "createActivity" && <ConfirmButton onClick={criarAtividade} disabled={processando}>{processando ? "Criando..." : "Criar"}</ConfirmButton>}
                {modal === "enroll" && <ConfirmButton onClick={matricularAluno} disabled={processando}>{processando ? "Matriculando..." : "Matricular"}</ConfirmButton>}
                {modal === "joinCode" && <ConfirmButton onClick={gerarJoinCode} disabled={processando}>{processando ? "Gerando..." : "Gerar novo código"}</ConfirmButton>}
                {modal === "delete" && <DangerButton onClick={excluirTurma} disabled={processando}>{processando ? "Excluindo..." : "Excluir turma"}</DangerButton>}
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        )}
      </Container>
    </>
  );
};

export default VisualizandoTurmasProfessor;
