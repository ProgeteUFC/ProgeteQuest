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

// export const Disciplinas = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background-color: ${(props) => props.theme.colors.white};
//   border-radius: 20px;
//   margin-top: 20px;
//   padding-bottom: 10px;

//   @media (max-width: 320px) {
//     width: 100%;
//   }

//   @media (min-width: 321px) and (max-width: 480px) {
//     width: 100%;
//   }

//   @media (min-width: 481px) and (max-width: 768px) {
//     width: 100%;
//   }

//   @media (min-width: 769px) and (max-width: 1024px) {
//     width: 60%;
//   }

//   @media (min-width: 1025px) and (max-width: 1280px) {
//     width: 55%;
//   }

//   @media (min-width: 1281px) {
//     width: 55%;
//   }
// `;

export const PlanetImage = styled.img`
  position: fixed;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 0;           

  /* MOBILE E TABLET (Até 768px) */
  @media (max-width: 768px) {
    display: none;
  }

  /* DESKTOP (Acima de 1024px) */
  @media (min-width: 1025px) {
    display: block;
    width: 450px;
    transform: translate(15%, 15%); 
  }
`;

export const ListaTurmas = styled.div`
  background: #fff;
  border-radius: 32px;
  padding: 22px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 95%;
  max-width: 450px;
  margin: 20px 0;
  max-height: 400px;  
`;

export const ListaTurmasScroll = styled.div`
  overflow-y: auto;
  border-radius: 20px;
  max-height: 298px; /* 342px - padding top/bottom */
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 5px;

  /* Barra de rolagem customizada */
  scrollbar-width: thin;
  scrollbar-color: #fff ${(props) => props.theme.colors.indigo};

  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 32px;
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.indigo};
    border-radius: 32px;
  }
`;

export const TurmaCard = styled.div`
  background: ${(props) => props.theme.colors.indigo};
  border-radius: 20px;
  padding: 16px 20px
  min-height: 60px;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  justify-content: space-between;
  cursor: pointer;
  

  &:hover{
    transition: background 0.2s, color 0.2s;
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
    outline: none;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
`;

export const TurmaNome = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


