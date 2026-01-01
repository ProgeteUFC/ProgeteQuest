import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  height: 100vh;
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
  margin-top: 60px;
  height: 50vh;
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  padding: 10px;
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

export const Disciplinas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 20px;
  margin-top: 20px;
  padding-bottom: 10px;

  @media (max-width: 320px) {
    width: 100%;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    width: 100%;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 60%;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    width: 55%;
  }

  @media (min-width: 1281px) {
    width: 55%;
  }
`;

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
