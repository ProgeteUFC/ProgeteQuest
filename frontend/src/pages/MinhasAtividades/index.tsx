import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../../components/Header";
import planetBlue from "../../assets/planet_blue_anel.png";
import progeteLogo from "../../assets/progete.png";
import { alunoService } from "../../services/alunoService";
import {
  ActionButton,
  AtividadeCard,
  AtividadeInfo,
  AtividadeNome,
  AtividadesContainer,
  CheckinForm,
  CodeInput,
  Container,
  Content,
  DateInfo,
  Disciplina,
  LogoProgete,
  PageState,
  PlanetImage,
  StatusBadge,
  StatusRow,
  Subtitle,
  Title,
} from "./styles";

interface AtividadeAluno {
  activityId: string;
  name: string;
  date: string;
  createdAt?: string;
  concludedAt?: string | null;
  status: "ok" | "pending";
}

export function MinhasAtividades() {
  const location = useLocation();
  const turmaId = new URLSearchParams(location.search).get("turma");
  const [atividades, setAtividades] = useState<AtividadeAluno[]>([]);
  const [nomeTurma, setNomeTurma] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [atividadeCheckin, setAtividadeCheckin] = useState<string | null>(null);
  const [codigoCheckin, setCodigoCheckin] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const removerAtividadesExpiradas = () => {
      const agora = Date.now();
      setAtividades((atuais) =>
        atuais.filter((atividade) => new Date(atividade.date).getTime() > agora)
      );
    };

    removerAtividadesExpiradas();
    const intervalId = window.setInterval(removerAtividadesExpiradas, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  function formatarDataCompleta(data?: string | Date | null) {
    if (!data) return "Não informada";
    const date = new Date(data);
    if (Number.isNaN(date.getTime())) return "Data inválida";

    return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  }

  useEffect(() => {
    let ativo = true;

    async function fetchAtividades() {
      if (!turmaId) {
        setErro("Turma não informada. Volte aos detalhes da turma e tente novamente.");
        setCarregando(false);
        return;
      }

      try {
        const token = localStorage.getItem("token") || "";
        const [atividadesResponse, turmaResponse] = await Promise.all([
          alunoService.listarAtividades(turmaId, token),
          alunoService.buscarTurma(turmaId, token),
        ]);

        if (ativo) {
          setAtividades(atividadesResponse.data);
          setNomeTurma(turmaResponse.data.name);
        }
      } catch (error: any) {
        if (ativo) {
          setErro(
            error?.response?.data?.message ||
              "Não foi possível carregar as atividades desta turma."
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    fetchAtividades();
    return () => {
      ativo = false;
    };
  }, [turmaId]);

  async function handleCheckin(
    event: FormEvent<HTMLFormElement>,
    activityId: string
  ) {
    event.preventDefault();
    const code = codigoCheckin.trim();

    if (!code) {
      setSucesso("");
      setErro("Digite o código do check-in.");
      return;
    }

    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await alunoService.realizarCheckin(
        { activityId, code },
        token
      );

      setAtividades((atuais) =>
        atuais.map((atividade) =>
          atividade.activityId === activityId
            ? {
                ...atividade,
                status: "ok",
                concludedAt: response.data.createdAt || new Date().toISOString(),
              }
            : atividade
        )
      );
      setSucesso("Check-in realizado com sucesso!");
      setAtividadeCheckin(null);
      setCodigoCheckin("");
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          "Não foi possível realizar o check-in. Confira o código e tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  function abrirCheckin(activityId: string) {
    setErro("");
    setSucesso("");
    setAtividadeCheckin(activityId);
    setCodigoCheckin("");
  }

  return (
    <Container>
      <Header />
      <Content>
        <Title>Minhas atividades</Title>
        <Subtitle>
          Aqui você visualiza as atividades propostas pelo(a) professor(a) na
          turma:
        </Subtitle>
        <Disciplina>{nomeTurma || "Turma"}</Disciplina>

        <AtividadesContainer>
          {carregando && <PageState>Carregando atividades...</PageState>}
          {!carregando && erro && atividades.length === 0 && (
            <PageState $error role="alert">{erro}</PageState>
          )}
          {!carregando && !erro && atividades.length === 0 && (
            <PageState>Nenhuma atividade cadastrada para esta turma.</PageState>
          )}

          {atividades.map((atividade) => {
            const concluida = atividade.status === "ok";

            return (
              <AtividadeCard key={atividade.activityId}>
                <AtividadeNome>{atividade.name}</AtividadeNome>
                <AtividadeInfo>
                  <DateInfo>
                    <span>
                      <strong>Início:</strong>{" "}
                      {formatarDataCompleta(atividade.createdAt)}
                    </span>
                    <span>
                      <strong>Prazo:</strong>{" "}
                      {formatarDataCompleta(atividade.date)}
                    </span>
                  </DateInfo>

                  <StatusRow>
                    {concluida ? (
                      <StatusBadge $completed>
                        <FaCheckCircle /> Check-in realizado em{" "}
                        {formatarDataCompleta(atividade.concludedAt)}
                      </StatusBadge>
                    ) : atividadeCheckin === atividade.activityId ? (
                      <CheckinForm
                        onSubmit={(event) =>
                          handleCheckin(event, atividade.activityId)
                        }
                      >
                        <CodeInput
                          aria-label={`Código de check-in para ${atividade.name}`}
                          autoFocus
                          autoComplete="off"
                          placeholder="Código do check-in"
                          value={codigoCheckin}
                          onChange={(event) =>
                            setCodigoCheckin(event.target.value)
                          }
                        />
                        <ActionButton type="submit" disabled={enviando}>
                          {enviando ? "Enviando..." : "Confirmar"}
                        </ActionButton>
                        <ActionButton
                          type="button"
                          $secondary
                          disabled={enviando}
                          onClick={() => {
                            setAtividadeCheckin(null);
                            setCodigoCheckin("");
                          }}
                        >
                          Cancelar
                        </ActionButton>
                      </CheckinForm>
                    ) : (
                      <ActionButton
                        type="button"
                        onClick={() => abrirCheckin(atividade.activityId)}
                      >
                        Fazer check-in
                      </ActionButton>
                    )}
                  </StatusRow>
                </AtividadeInfo>
              </AtividadeCard>
            );
          })}

          {erro && atividades.length > 0 && (
            <PageState $error role="alert">{erro}</PageState>
          )}
          {sucesso && <PageState $success>{sucesso}</PageState>}
        </AtividadesContainer>
      </Content>

      <LogoProgete src={progeteLogo} alt="Progete" />
      <PlanetImage src={planetBlue} alt="" aria-hidden="true" />
    </Container>
  );
}
