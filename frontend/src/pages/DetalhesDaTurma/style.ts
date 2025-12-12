import styled from "styled-components";

export const Pagina = styled.h1`
  color: white;
  background-color: ${(props) => props.theme.colors.primaryDark};
  padding: 4% 15%;
  font-family: "Baloo Paaji 2", sans-serif;
  position: relative;
  overflow: hidden;
  z-index: -1;
`;

export const TituloPagina = styled.h1`
  font-size: 34px;
`;

export const SubTituloPagina = styled.h1`
  font-size: 20px;
  margin-bottom: 14px;
`;

export const LogoProgete = styled.img`
  position: absolute;
  bottom: 20px;
  left: 40px;

  @media (max-width: 1400px){
    display: none;
  }
`;

export const PlanetaAzulClaro = styled.img`
  position: absolute;
  bottom: -130px;
  right: -110px;
  z-index: -1; 
  pointer-events: none;

  @media (max-width: 1400px){
    display: none;
  }
`;

export const PageContent = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 1400px){
    display: block;
  }
`;

export const InfosProfessor = styled.div`
  display: flex;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  max-width: 370px;
  gap: 10px;
  padding: 15px 30px 15px 15px;

  @media (max-width: 1400px){
    width: 108%;
  }
`;

export const NomeProfessor = styled.p`
  font-size: 16px;
  color: #2c0383;
`;

export const ContatoProfessor = styled.p`
  font-size: 16px;
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
  font-size: 16px;
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

  @media (max-width: 1400px){
    margin-top: 20px;
    width: 100%;
  }
`;

export const VizualizarAtividades = styled.button`
  border: none;
  background-color: #2c0383;
  color: white;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 15px;
  text-align: left;
  cursor: pointer;

  &:active {
    scale: 0.97;
    background-color: ${(props) => props.theme.colors.challengeOrange};
    transition-duration: 100ms;
  }
`;

export const VizualizarMembros = styled.button`
  border: none;
  background-color: rgba(44, 3, 131, 1);
  color: white;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 15px;
  text-align: left;
  cursor: pointer;

  &:active {
    scale: 0.97;
    background-color: ${(props) => props.theme.colors.challengeOrange};
    transition-duration: 100ms;
  }
`;

export const ColocacaoAluno = styled.div`
  display: flex;
  background-color: white;
  align-items: center;
  border-radius: 20px;
  gap: 10px;
  width: max-content;
  padding: 15px 30px 15px 15px;
  width: 370px;
`;

export const ColocacaoTexto = styled.p`
  font-size: 16px;
  color: #2c0383;
`;

export const RankingAlunos = styled.div`
  background-color: white;
  padding: 10px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 1400px){
    margin-top: 20px;
    width: 108%;
  }
`;

export const Estrelas = styled.div`
  display: flex;
`;