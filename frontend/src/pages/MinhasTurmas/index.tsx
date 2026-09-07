import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import planetBlue from "../../assets/planet_blue_anel.png";
import progeteLogo from "../../assets/progete.png";
import { alunoService } from "../../services/alunoService";
import {
  Container,
  Content,
  ListaTurmas,
  ListaTurmasScroll,
  LogoProgete,
  PlanetImage,
  StateMessage,
  Subtitle,
  Title,
  TurmaCard,
  TurmaNome,
} from "./styles";

export function MinhasTurmas() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const token = localStorage.getItem("token") || "";
        const studentId = localStorage.getItem("userId") || "";
        const response = await alunoService.listarTurmas(studentId, token);
        setTurmas(response.data);
      } catch {
        setErro("Erro ao buscar turmas.");
      } finally {
        setCarregando(false);
      }
    }

    fetchTurmas();
  }, []);

  return (
    <Container>
      <Header />
      <Content>
        <Title>Minhas turmas</Title>
        <Subtitle>
          Aqui você pode consultar as turmas em que está matriculado(a)
        </Subtitle>

        <ListaTurmas>
          <ListaTurmasScroll>
            {carregando && <StateMessage>Carregando turmas...</StateMessage>}

            {!carregando && turmas.length === 0 && !erro && (
              <StateMessage>
                Você ainda não está matriculado(a) em nenhuma turma.
              </StateMessage>
            )}

            {turmas.map((turma) => (
              <TurmaCard
                key={turma.classId}
                type="button"
                onClick={() => navigate(`/detalhesDaTurma/${turma.classId}`)}
              >
                <TurmaNome>{turma.name}</TurmaNome>
              </TurmaCard>
            ))}

            {erro && <StateMessage $error>{erro}</StateMessage>}
          </ListaTurmasScroll>
        </ListaTurmas>
      </Content>

      <LogoProgete src={progeteLogo} alt="Progete" />
      <PlanetImage src={planetBlue} alt="" aria-hidden="true" />
    </Container>
  );
}
