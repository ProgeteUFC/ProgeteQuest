import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import {
  Container,
  Content,
  AtividadesContainer,
  AtividadeCard,
  AtividadeNome,
  AtividadeInfo,
  StatusIcon,
  Disciplina,
  PlanetImage,
} from "./styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { alunoService } from "../../services/alunoService";

export function MinhasAtividades() {
  const location = useLocation();
  const turmaId = new URLSearchParams(location.search).get("turma");
  const [atividades, setAtividades] = useState<any[]>([]);
  const [nomeTurma, setNomeTurma] = useState<string>("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [atividadeCheckin, setAtividadeCheckin] = useState<string | null>(null);
  const [codigoCheckin, setCodigoCheckin] = useState("");

  function formatarDataCompleta(data: string | Date | undefined) {
    if (!data) return "-";
    const d = new Date(data);
    return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`;
  }

  useEffect(() => {
    async function fetchAtividades() {
      try {
        const token = localStorage.getItem("token") || "";
        if (!turmaId) return;
        // Buscar atividades
        const res = await alunoService.listarAtividades(turmaId, token);
        setAtividades(res.data);

        // Buscar nome da turma
        const turmaRes = await alunoService.buscarTurma(turmaId, token);
        setNomeTurma(turmaRes.data.name);
      } catch (err: any) {
        setErro("Erro ao buscar atividades.");
      }
    }
    fetchAtividades();
  }, [turmaId, sucesso]);

  async function handleCheckin(activityId: string, codigo: string) {
    setErro("");
    setSucesso("");
    try {
      const token = localStorage.getItem("token") || "";
      const studentId = localStorage.getItem("userId") || "";

      // Buscar o código pelo valor digitado e validar se está ativo
      const codeRes = await alunoService.buscarCodigoAtividade(activityId, token);
      const codeObj = codeRes.data.find((c: any) => c.code === codigo && c.active);

      if (!codeObj) {
        setErro("Código inválido ou inativo para esta atividade.");
        return;
      }

      await alunoService.realizarCheckin(
        { activityId, studentId, codeId: codeObj.codeId },
        token
      );
      setSucesso("Check-in realizado com sucesso!");
      setAtividadeCheckin(null);
      setCodigoCheckin("");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
        "Erro ao realizar check-in. Verifique o código e tente novamente."
      );
    }
  }

  return (
    <Container>
      <Header />
      <Content>
        <TitleName titleName="Atividades" />
        <TitleDescription titleDescription="Aqui você visualiza as atividades/desafios propostos pelo(a) professor(a) na turma de:" />
        <Disciplina>
          <span>{nomeTurma || "Turma"}</span>
        </Disciplina>
        <AtividadesContainer>
          {atividades.length === 0 && !erro && (
            <div style={{ color: "#2c0383", fontWeight: "bold", padding: "24px", textAlign: "center" }}>
              Nenhuma atividade cadastrada para esta turma.
            </div>
          )}
          {atividades.map((a, i) => (
            <AtividadeCard key={a.activityId}>
              <AtividadeNome>{a.name}</AtividadeNome>
              <AtividadeInfo>
                <div>
                  <b>Início:</b> {formatarDataCompleta(a.createdAt)}{" "}
                  <b>Finaliza em:</b> {formatarDataCompleta(a.date)}
                </div>
                {a.status === "ok" && (
                  <>
                    <StatusIcon
                      status={a.status}
                      title={
                        a.concludedAt
                          ? `Concluída em: ${formatarDataCompleta(a.concludedAt)}`
                          : ""
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <FaCheckCircle />
                    </StatusIcon>
                    <span
                      style={{ color: "#4ade80", marginLeft: 12, cursor: "pointer" }}
                      title={
                        a.concludedAt
                          ? `Concluída em: ${formatarDataCompleta(a.concludedAt)}`
                          : ""
                      }
                    >
                      Concluída
                    </span>
                  </>
                )}
                {a.status !== "ok" && (
                  <>
                    {atividadeCheckin === a.activityId ? (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleCheckin(a.activityId, codigoCheckin);
                        }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                      >
                        <input
                          type="text"
                          placeholder="Código do check-in"
                          value={codigoCheckin}
                          onChange={e => setCodigoCheckin(e.target.value)}
                          style={{
                            borderRadius: 8,
                            border: "1px solid #aaa",
                            padding: "4px 8px",
                            fontSize: 14,
                            width: 120,
                          }}
                          required
                        />
                        <button
                          type="submit"
                          style={{
                            background: "#4ade80",
                            color: "#222",
                            border: "none",
                            borderRadius: 8,
                            padding: "4px 12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Enviar
                        </button>
                        <button
                          type="button"
                          style={{
                            background: "#fff",
                            color: "#2c0383",
                            border: "1px solid #2c0383",
                            borderRadius: 8,
                            padding: "4px 12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginLeft: 4,
                          }}
                          onClick={() => {
                            setAtividadeCheckin(null);
                            setCodigoCheckin("");
                          }}
                        >
                          Cancelar
                        </button>
                      </form>
                    ) : (
                      <button
                        style={{
                          marginLeft: 16,
                          background: "#4ade80",
                          color: "#222",
                          border: "none",
                          borderRadius: 12,
                          padding: "6px 16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setAtividadeCheckin(a.activityId);
                          setCodigoCheckin("");
                        }}
                      >
                        Fazer check-in
                      </button>
                    )}
                  </>
                )}
              </AtividadeInfo>
            </AtividadeCard>
          ))}
          {erro && <div style={{ color: "red" }}>{erro}</div>}
          {sucesso && <div style={{ color: "green" }}>{sucesso}</div>}
        </AtividadesContainer>
      </Content>
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
}
