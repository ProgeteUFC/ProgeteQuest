import styled from "styled-components";

export const Pagina = styled.div`
  color: white;
  background-color: ${(props) => props.theme.colors.primaryDark};
  height: 84.3vh; //REFERÊNCIA - JÁ CONTA COM O ESPAÇO DA HEADER
  font-family: "Baloo Paaji 2", sans-serif;
  position: relative;
  overflow: hidden;
`;

export const TituloPagina = styled.h1`
  font-size: 34px;
  font-weight: 800;
  margin-left: 150px;
  margin-top: 80px;
  margin-bottom: 1px;
`;

export const SubTituloPagina = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin-left: 150px;
  margin-bottom: 1px;
`;

export const LogoProgete = styled.img`
  position: absolute;

  left: 2rem;
  bottom: 0.7rem;
  height: 48px;

  @media (max-width: 1400px) {
    display: none;
  }
`;

export const PlanetaAzulClaro = styled.img`
  // REFERÊNCIA - IMAGEM DO PLANETA AZUL CLARO
  position: fixed;
  width: 650px;
  bottom: 0;
  right: 0;
  transform: translate(20%, 20%);

  @media (max-width: 1400px) {
    display: none;
  }
`;

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;

  overflow: hidden;

  @media (max-width: 768px) {
    overflow-y: auto;
    padding: 0;
    align-items: flex-start;
    height: auto;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 900px;
  margin-left: 150px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  z-index: 1;

  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    max-width: 100vw;
  }
`;

export const InfosProfessor = styled.div`
  display: flex;
  height: 111px;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  max-width: 370px;
  gap: 10px;
  padding: 15px 30px 15px 15px;

  @media (max-width: 1400px) {
    width: 108%;
  }
`;

export const NomeProfessor = styled.p`
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  color: #2c0383;
  padding-bottom: 10px;
`;

export const ContatoProfessor = styled.p`
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  color: #2c0383;
`;

export const QuantAlunos = styled.div`
  display: flex;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  width: max-content;
  padding: 15px 30px 15px 15px;
  width: 370px;
`;

export const QuantAlunosValor = styled.p`
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  color: #2c0383;
`;

export const ProfessorEturma = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OpcoesTurma = styled.div`
  background-color: white;
  gap: 14px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  min-width: 370px;

  @media (max-width: 1400px) {
    margin-top: 20px;
    width: 100%;
  }
`;

export const VizualizarAtividades = styled.button`
  border: none;
  background-color: #4a4385;
  color: white;
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 15px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
    transition: background 0.2s, color 0.2s;
    z-index: 100;
  }

  &:active {
    scale: 0.97;
    background-color: ${(props) => props.theme.colors.challengeOrange};
    transition-duration: 100ms;
  }
`;

export const VizualizarMembros = styled.button`
  border: none;
  background-color: #4a4385;
  color: white;
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 15px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
    transition: background 0.2s, color 0.2s;
    z-index: 100;
  }

  &:active {
    scale: 0.97;
    background-color: ${(props) => props.theme.colors.challengeOrange};
    transition-duration: 100ms;
  }
`;

export const ColocacaoAluno = styled.div`
  display: flex;
  height: 93px;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  width: max-content;
  padding: 15px 30px 15px 15px;
  width: 370px;
`;

export const ColocacaoTexto = styled.p`
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  color: #2c0383;
`;

export const RankingAlunos = styled.div`
  background-color: white;
  padding: 20px 20px;
  margin-top: -60px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;

  @media (max-width: 1400px) {
    margin-top: 20px;
    width: 108%;
  }
`;

export const Estrelas = styled.div`
  display: flex;
`;
