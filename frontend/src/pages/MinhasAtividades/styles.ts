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
  margin: 0 auto;
`;

export const Disciplina = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.challengeOrange};
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  span {
    color: ${(props) => props.theme.colors.challengeOrange};
  }
`;

export const AtividadesContainer = styled.div`
  background: #fff;
  border-radius: 40px;
  padding: 1.2rem 0.5rem;
  margin-top: 1.2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 750px;
  max-width: 95%;
  min-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.colors.indigo} #eee;

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
    background: #eee;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.indigo};
    border-radius: 8px;
  }
`;

export const AtividadeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.colors.indigo};
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  color: #fff;
  font-size: 1.05rem;
  font-family: "Baloo Paaji 2", sans-serif;
  z-index: 1;
`;

export const AtividadeNome = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  flex: 1;
`;

export const AtividadeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1rem;
  b {
    font-weight: bold;
    margin: 0 0.2rem;
  }
`;

export const StatusIcon = styled.span<{ status: string }>`
  margin-left: 1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  color: ${({ status, theme }) =>
    status === "ok" ? "#4ade80" : theme.colors.challengeOrange};
`;

export const PlanetImage = styled.img`
  position: fixed;
  width: 700px;
  // z-index: 2;
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
