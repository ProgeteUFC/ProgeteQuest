import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  color: white;
  background: ${(props) => props.theme.colors.primaryDark};
  font-family: "Baloo Paaji 2", sans-serif;

  @media (max-width: 768px) { min-height: 100dvh; overflow-y: auto; }
`;

export const Content = styled.main`
  position: relative;
  z-index: 2;
  width: min(840px, calc(100% - 48px));
  margin-left: 180px;
  padding: 40px 0 110px;

  @media (max-width: 1024px) {
    width: min(700px, calc(100% - 48px));
    margin: 0 auto;
  }
  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 52px 0 110px;
  }
`;

export const ForumTitle = styled.h1`
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
`;

export const ForumDescription = styled.p`
  max-width: 720px;
  margin-top: 8px;
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  @media (max-width: 768px) { font-size: 20px; }
`;

export const ListaTurmas = styled.section`
  width: min(400px, 100%);
  max-height: 342px;
  margin-top: 56px;
  padding: 22px 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    width: 100%; max-height: min(390px, 48vh); margin-top: 36px; padding: 16px 12px; border-radius: 24px;
  }
`;

export const ListaTurmasScroll = styled.div`
  max-height: 298px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 5px;
  border-radius: 20px;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.colors.indigo} white;
  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-track { background: white; }
  &::-webkit-scrollbar-thumb { border-radius: 32px; background: ${(props) => props.theme.colors.indigo}; }
`;

export const TurmaCard = styled.div`
  min-height: 42px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  &:hover, &:focus-visible { background: ${(props) => props.theme.colors.challengeOrange}; outline: none; }
  &:active { transform: scale(0.98); }
`;

export const TurmaNome = styled.div`
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

export const ForumState = styled.p<{ $error?: boolean }>`
  padding: 18px 12px;
  color: ${(props) => props.$error ? "#b42318" : props.theme.colors.primaryDark};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
`;

export const PlanetImage = styled.img`
  position: fixed;
  z-index: 1;
  width: 1200px;
  max-width: 60vw;
  right: -300px;
  bottom: -150px;
  pointer-events: none;
  @media (max-width: 1439px) { display: none; }
`;

export const LogoProgete = styled.img`
  position: fixed;
  z-index: 2;
  bottom: 31px;
  left: 52px;
  height: 48px;
  width: auto;
  @media (max-width: 768px) { left: 36px; bottom: 28px; height: 30px; }
`;
