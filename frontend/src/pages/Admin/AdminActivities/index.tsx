
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  turmaService,
  type AtividadeTurma,
  type TurmaProfessor,
} from "../../../services/turmaService";

import {
  ActivitiesContainer,
  ActivitiesCard,
  FilterContainer,
  TableContainer,
  ActivitiesTable,
  ManageButton,
  ActivitiesFeedback,
} from "./styles";

type AtividadeAdministrativa = {
  atividade: AtividadeTurma;
  turma: TurmaProfessor;
};

export default function AdminActivities() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<TurmaProfessor[]>([]);
  const [atividades, setAtividades] = useState<
    AtividadeAdministrativa[]
  >([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarAtividades() {
      setCarregando(true);
      setErro("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Sessão não encontrada.");
        }

        const respostaTurmas =
          await turmaService.listarTurmasProfessor(token);

        const turmasEncontradas = respostaTurmas.data;

        const resultados = await Promise.allSettled(
          turmasEncontradas.map(async (turma) => {
            const resposta =
              await turmaService.listarAtividades(
                turma.classId,
                token
              );

            return resposta.data.map((atividade) => ({
              atividade,
              turma,
            }));
          })
        );

        const houveFalha = resultados.some(
          (resultado) => resultado.status === "rejected"
        );

        if (houveFalha) {
          throw new Error(
            "Não foi possível consultar todas as atividades."
          );
        }

        const lista = resultados.flatMap((resultado) =>
          resultado.status === "fulfilled"
            ? resultado.value
            : []
        );

        lista.sort(
          (a, b) =>
            new Date(b.atividade.date).getTime() -
            new Date(a.atividade.date).getTime()
        );

        if (!ativo) return;

        setTurmas(turmasEncontradas);
        setAtividades(lista);
      } catch (error: unknown) {
        if (!ativo) return;

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as atividades."
        );
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAtividades();

    return () => {
      ativo = false;
    };
  }, []);

  const atividadesFiltradas = useMemo(() => {
    if (!turmaSelecionada) return atividades;

    return atividades.filter(
      ({ turma }) => turma.classId === turmaSelecionada
    );
  }, [atividades, turmaSelecionada]);

  function formatarData(data: string) {
    const valor = new Date(data);

    return Number.isNaN(valor.getTime())
      ? "Data indisponível"
      : valor.toLocaleString("pt-BR");
  }

  return (
    <ActivitiesContainer>
      <h1>Atividades</h1>
      <p>Consulte as atividades cadastradas nas turmas.</p>

      <ActivitiesCard>
        {carregando ? (
          <ActivitiesFeedback role="status">
            Carregando atividades...
          </ActivitiesFeedback>
        ) : erro ? (
          <ActivitiesFeedback role="alert">
            {erro}
          </ActivitiesFeedback>
        ) : (
          <>
            <FilterContainer>
              <label htmlFor="filtro-turma">
                Filtrar por turma
              </label>

              <select
                id="filtro-turma"
                value={turmaSelecionada}
                onChange={(event) =>
                  setTurmaSelecionada(event.target.value)
                }
              >
                <option value="">Todas as turmas</option>

                {turmas.map((turma) => (
                  <option
                    key={turma.classId}
                    value={turma.classId}
                  >
                    {turma.name}
                  </option>
                ))}
              </select>
            </FilterContainer>

            {atividadesFiltradas.length === 0 ? (
              <ActivitiesFeedback>
                Nenhuma atividade encontrada.
              </ActivitiesFeedback>
            ) : (
              <TableContainer>
                <ActivitiesTable>
                  <thead>
                    <tr>
                      <th scope="col">Atividade</th>
                      <th scope="col">Turma</th>
                      <th scope="col">Professor</th>
                      <th scope="col">Data</th>
                      <th scope="col">Ação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {atividadesFiltradas.map(
                      ({ atividade, turma }) => (
                        <tr key={atividade.activityId}>
                          <td>{atividade.name}</td>
                          <td>{turma.name}</td>
                          <td>
                            {turma.teacher?.user?.name ||
                              "Não informado"}
                          </td>
                          <td>
                            {formatarData(atividade.date)}
                          </td>
                          <td>
                            <ManageButton
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/admin/classes/${turma.classId}`
                                )
                              }
                            >
                              Gerenciar
                            </ManageButton>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </ActivitiesTable>
              </TableContainer>
            )}
          </>
        )}
      </ActivitiesCard>
    </ActivitiesContainer>
  );
}
