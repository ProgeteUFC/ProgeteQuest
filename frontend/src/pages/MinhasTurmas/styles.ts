import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100vw;
  position: relative;
  
  @media (max-width: 320px) {
    justify-content: center;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    justify-content: center;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    justify-content: center;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    justify-content: center;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    flex-direction: column;
  }

  @media (min-width: 1281px) {
    flex-direction: column;
  }
`;

export const Content = styled.div`
  padding: 40px 0 0 0;
  max-width: 900px;
  margin-top: 25px;
  // margin: 0 auto;

  @media (max-width: 320px) {
    width: 80%;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    width: 80%;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: 80%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 80%;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    width: 80%;
    margin-left: 120px;
  }

  @media (min-width: 1281px) {
    width: 80%;
    margin-left: 160px;
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
  width: 700px;
  z-index: 2;
  bottom: 0;
  right: 0;
  transform: translate(20%, 20%);

  @media (max-width: 1400px) {
    width: 500px;
    transform: translate(10%, 10%);
  }
  @media (max-width: 900px) {
    width: 350px;
    transform: translate(10%, 10%);
  }
`;

export const ListaTurmas = styled.div`
  margin: 0 0 0 25px;
  background: #fff;
  border-radius: 32px;
  padding: 22px 16px;
  width: 400px;
  max-height: 342px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* Importante para esconder a barra fora do card */
  display: flex;
  flex-direction: column;
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
  padding: 8px 18px;
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
`;

export const TurmaNome = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


