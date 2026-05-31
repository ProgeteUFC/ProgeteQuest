import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;         
  flex-direction: column; 
  overflow-x: hidden; 
`;

export const Content = styled.main`
  padding: 0px 20px 0 20px;
  max-width: 900px;
  margin-top: 25px;
  // margin: 0 auto;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px;

  @media (min-width: 1024px) {
    align-items: flex-start;
    margin-left: 10%;
    width: 80%;
    max-width: 1200px;
  }
`;

export const HeaderInfo = styled.div`
  margin-bottom: 10px;
  z-index: 2; /* Fica acima das imagens de fundo */
  font-family: "Baloo Paaji 2", sans-serif;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
  }

  p {
  margin-top: 5px;  
  font-size: 1.25rem;
    font-weight: 500;
  }
`;

export const DashboardGrid = styled.div`
  display: flex;
  gap: 30px;
  z-index: 2;
`;

export const ActionCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
`;

export const ActionButton = styled.button`
  background-color: #5A4B81; /* Cor roxa mais clara dos botões */
  color: #FFFFFF;
  border: none;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #453965;
  }
`;

export const RankingCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
`;

export const RankingItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
  gap: 15px;

  .badge {
    background-color: #2D0B5A;
    color: #FFFFFF;
    font-weight: bold;
    font-size: 1rem;
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 45px;
  }

  .name {
    color: #333333;
    font-weight: bold;
    font-size: 1rem;
  }
`;

/* Estilos para as imagens decorativas */
export const PlanetImage = styled.img`
  position: fixed;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 0;           

  /* MOBILE E TABLET (Até 768px) */
  @media (max-width: 768px) {
    display: none;
    width: 300px;
  }

/* DESKTOP (Acima de 1024px) */
@media (min-width: 1025px) {
  display: block;
  /* Aumenta o tamanho consideravelmente */
  width: 1200px;
  
  /* Ajusta a ancoragem para cobrir mais o canto */
  bottom: -150px; 
  right: -300px;

  /* Move o planeta mais para DENTRO da tela (menos para fora) */
  /* Reduzido de 15% para 5%, o que traz a maior parte dele para visibilidade */
  transform: translate(5%, 5%); 
}
`;

export const Estrelas = styled.div`
  display: flex;
  justify-content: center;
`;