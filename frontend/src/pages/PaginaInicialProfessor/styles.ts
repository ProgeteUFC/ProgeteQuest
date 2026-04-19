import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;         
  flex-direction: column; 
  overflow-x: hidden;      
`;

export const Content = styled.div`
  padding: 40px 20px 0 20px;
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

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  justify-content: flex-start;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
  padding: 0 8px; 
  gap: 12px; 
  height: 120px;
  border-radius: 20px;
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 12px; 
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  gap: 20px; 
`;


export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  color: white;
  align-items: center;
  border-radius: 20px;
  padding: 1px 0px;
  height: 60px;
  width: 150px;
  justify-content: center;
  gap: 25px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;

  &:active {
    scale: 0.97;
    transition-duration: 100ms;
  }
  
  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

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

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px; // Espaço entre o menu e o texto
  max-width: 600px;  // Limita a largura para o texto quebrar como na imagem
`;

export const DescriptionText = styled.p`
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
  margin: 0;
`;