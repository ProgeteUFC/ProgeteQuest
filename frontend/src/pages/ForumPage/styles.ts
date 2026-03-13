import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100vw;
  position: relative;
`;

export const Content = styled.div`
  padding: 40px 0 0 0;
  max-width: 900px;
  // margin: 0 auto;
`;

export const ListaTurmas = styled.div`
  background: #fff;
  border-radius: 32px;
  padding: 22px 16px;
  width: 400px;
  max-height: 342px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-left: 180px;
`;



export const ListaTurmasScroll = styled.div`
  overflow-y: auto;
  border-radius: 20px;
  max-height: 298px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 5px;

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
  transition: background 0.2s, color 0.2s;

  &:hover,
  &:focus {
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

export const PlanetImage = styled.img`
  position: fixed;
  width: 700px;
  bottom: 0;
  right: 0;
  transform: translate(20%, 20%);
  pointer-events: none;

  @media (max-width: 1400px) {
    width: 500px;
    transform: translate(10%, 10%);
  }
  @media (max-width: 900px) {
    width: 350px;
    transform: translate(10%, 10%);
  }
`;

export const ForumTitle = styled.h1`
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  font-family: "Baloo Paaji 2", sans-serif;
  margin-left:180px;
`;

export const ForumDescription = styled.p`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
  margin-left:180px;
  line-height: 1.2;
`;