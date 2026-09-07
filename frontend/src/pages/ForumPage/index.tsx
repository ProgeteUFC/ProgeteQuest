import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import {
  Container,
  Content,
  ListaTurmas,
  ListaTurmasScroll,
  TurmaCard,
  TurmaNome,
  PlanetImage,
  ForumTitle,
  ForumDescription,
  LogoProgete,
  ForumState,
} from "./styles";
import planetOrange from "../../assets/planet_orange.png";
import progeteLogo from "../../assets/progete.png";
import { turmaService } from "../../services/turmaService";
import { alunoService } from "../../services/alunoService";

interface TurmaForum { id: string; nome: string }

export default function ForumPage() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<TurmaForum[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function carregarTurmas() {
      try {
        const token = localStorage.getItem("token") || "";
        const userType = localStorage.getItem("userType");
        const userId = localStorage.getItem("userId") || "";
        const response = userType === "teacher"
          ? await turmaService.listarTurmasProfessor(token)
          : await alunoService.listarTurmas(userId, token);
        if (ativo) {
          setTurmas(response.data.map((turma: any) => ({ id: turma.classId, nome: turma.name })));
        }
      } catch (error: any) {
        if (ativo) setErro(error?.response?.data?.message || "Não foi possível carregar as turmas.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarTurmas();
    return () => { ativo = false; };
  }, []);
  return (
    <Container>
      <Header />
      <Content>
        <ForumTitle>Fórum</ForumTitle>
        <ForumDescription>
          Escolha o fórum da turma desejada para conversar e tirar dúvidas com seus colegas.
        </ForumDescription>
        <ListaTurmas>
          <ListaTurmasScroll>
            {carregando && <ForumState>Carregando turmas...</ForumState>}
            {!carregando && erro && <ForumState $error>{erro}</ForumState>}
            {!carregando && !erro && turmas.length === 0 && <ForumState>Nenhuma turma associada ao seu perfil.</ForumState>}
            {!carregando && !erro && turmas.map((turma) => (
              <TurmaCard
                key={turma.id}
                tabIndex={0}
                onClick={() => navigate(`/forum/${turma.id}`)}
                onKeyDown={(event) => event.key === "Enter" && navigate(`/forum/${turma.id}`)}
                role="button"
              >
                <TurmaNome>{turma.nome}</TurmaNome>
              </TurmaCard>
            ))}
          </ListaTurmasScroll>
        </ListaTurmas>
      </Content>
      <LogoProgete src={progeteLogo} alt="Progete" />
      <PlanetImage src={planetOrange} alt="" />
    </Container>
  );
}
