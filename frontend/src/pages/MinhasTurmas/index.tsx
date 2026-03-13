import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { TitleDescription } from "../../components/TitleDescription";
import { TitleName } from "../../components/TitleName";
import {
  Container,
  Content,
  PlanetImage,
  ListaTurmas,
  TurmaCard,
  TurmaNome,
  ListaTurmasScroll,
} from "./styles";
import planet_blue_anel from "../../assets/planet_blue_anel.png";
import { alunoService } from "../../services/alunoService";

export function MinhasTurmas() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const token = localStorage.getItem("token") || "";
        const studentId = localStorage.getItem("userId") || "";
        const res = await alunoService.listarTurmas(studentId, token);
        setTurmas(res.data);
      } catch (err: any) {
        setErro("Erro ao buscar turmas.");
      }
    }
    fetchTurmas();
  }, []);

  return (
    <Container>
      <Header />
      <Content>
        <TitleName titleName="Minhas turmas" />
        <TitleDescription titleDescription="Aqui você pode consultar as turmas em que você está matriculado(a)" />
        <ListaTurmas>
          <ListaTurmasScroll>
            {turmas.length === 0 && !erro && (
              <div style={{ color: "#2c0383", fontWeight: "bold", padding: "24px", textAlign: "center" }}>
                Você ainda não está matriculado em nenhuma turma.
              </div>
            )}
            {turmas.map((turma, idx) => (
              <TurmaCard
                key={turma.classId}
                tabIndex={0}
                onClick={() => navigate(`/detalhesDaTurma/${turma.classId}`)}
              >
                <TurmaNome>{turma.name}</TurmaNome>
              </TurmaCard>
            ))}
            {erro && <div style={{ color: "red" }}>{erro}</div>}
          </ListaTurmasScroll>
        </ListaTurmas>
      </Content>
      <Footer />
      <PlanetImage src={planet_blue_anel} alt="Planeta Azul" />
    </Container>
  );
}
