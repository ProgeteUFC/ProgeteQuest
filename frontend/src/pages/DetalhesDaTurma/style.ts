import styled from "styled-components";

export const Pagina = styled.div`
  color: white;
  background-color: ${(props) => props.theme.colors.primaryDark};
  min-height: 84.3vh; //REFERÊNCIA - JÁ CONTA COM O ESPAÇO DA HEADER
  font-family: "Baloo Paaji 2", sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 10px;
`;

export const TituloPagina = styled.h1`
  font-size: 34px;
  font-weight: 800;
  margin-left: 150px;
  margin-top: 80px;
  margin-bottom: 1px;

  @media (max-width: 1024px) {
    margin-left: 0;
    text-align: center;
    margin-top: 40px;
  }
`;

export const SubTituloPagina = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin-left: 150px;
  margin-bottom: 1px;

  @media (max-width: 1024px) {
    margin-left: 0;
    text-align: center;
    font-size: 20px;
    padding: 0 15px;
  }
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

export const PageContent = styled.div`
  width: 100%;
  max-width: 900px;
  margin-left: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    margin-left: 0;
    margin-top: 2rem;
    max-width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
`;

export const InfosProfessor = styled.div`
  display: flex;
  height: 111px;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  padding: 15px 30px 15px 15px;
  width: 370px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: 100%;
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
  padding: 15px 30px 15px 15px;
  width: 370px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: 100%;
  }
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

  @media (max-width: 1024px) {
    width: 100%;
    align-items: center;
  }
`;

export const OpcoesTurma = styled.div`
  background-color: white;
  gap: 14px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 370px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
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
    transition: 0.2s;
  }
`;

export const VizualizarMembros = styled(VizualizarAtividades)``;

export const ColocacaoAluno = styled.div`
  display: flex;
  height: 93px;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  padding: 15px 30px 15px 15px;
  width: 370px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const ColocacaoTexto = styled.p`
  font-family: "Codec Pro", sans-serif;
  font-size: 14px;
  color: #2c0383;
`;

export const RankingAlunos = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: -60px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
  width: 370px;
  box-sizing: border-box;

  @media (max-width: 1400px) {
    margin-top: 20px;
    width: 100%;
  }
`;

export const Estrelas = styled.div`
  display: flex;
  justify-content: center;
`;