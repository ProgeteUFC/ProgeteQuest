import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
`;

export const Content = styled.section`
  position: relative;
  z-index: 2;
  width: min(840px, calc(100% - 48px));
  margin-left: 180px;
  padding: 40px 0 120px;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding-top: 52px;
    padding-bottom: 100px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  max-width: 760px;
  margin: 8px 0 0;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
`;

export const ListaTurmas = styled.div`
  width: min(450px, 100%);
  margin-top: 56px;
  padding: 22px 16px;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    margin-top: 36px;
    padding: 14px 12px;
    border-radius: 24px;
  }
`;

export const ListaTurmasScroll = styled.div`
  display: flex;
  max-height: 390px;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  padding: 2px 6px 2px 2px;

  scrollbar-color: ${({ theme }) => theme.colors.secondary} transparent;
  scrollbar-width: thin;
`;

export const TurmaCard = styled.button`
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  padding: 8px 18px;
  border: 0;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.indigo};
  color: ${({ theme }) => theme.colors.white};
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.challengeOrange};
    outline: none;
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const TurmaNome = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StateMessage = styled.p<{ $error?: boolean }>`
  margin: 8px;
  color: ${({ $error, theme }) =>
    $error ? theme.colors.challengeOrange : theme.colors.primaryDark};
  font-size: 17px;
  font-weight: 700;
  text-align: center;
`;

export const PlanetImage = styled.img`
  position: fixed;
  z-index: 1;
  right: -100px;
  bottom: -150px;
  width: 1100px;
  max-width: 50vw;
  pointer-events: none;
  user-select: none;

  @media (max-width: 1439px) {
    display: none;
  }
`;

export const LogoProgete = styled.img`
  position: fixed;
  z-index: 2;
  bottom: 31px;
  left: 52px;
  height: 48px;

  @media (max-width: 768px) {
    bottom: 28px;
    left: 36px;
    height: 30px;
  }
`;
