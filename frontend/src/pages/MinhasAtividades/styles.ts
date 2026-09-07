import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.primaryDark};
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
`;

export const Content = styled.section`
  position: relative;
  z-index: 2;
  width: min(900px, calc(100% - 48px));
  margin-left: 180px;
  padding: 40px 0 120px;

  @media (max-width: 1100px) {
    width: calc(100% - 48px);
    margin: 0 24px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding-top: 52px;
    padding-bottom: 110px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font: inherit;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
`;

export const Subtitle = styled.p`
  max-width: 760px;
  margin: 8px 0 0;
  font: inherit;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
`;

export const Disciplina = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.challengeOrange};
  font-size: 24px;
  font-weight: 800;
`;

export const AtividadesContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 520px;
  flex-direction: column;
  gap: 14px;
  margin-top: 30px;
  padding: 20px;
  overflow-y: auto;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.white};
  scrollbar-color: ${({ theme }) => theme.colors.indigo} transparent;
  scrollbar-width: thin;

  @media (max-width: 768px) {
    max-height: none;
    margin-top: 36px;
    padding: 14px 12px;
    border-radius: 24px;
  }
`;

export const AtividadeCard = styled.article`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(280px, 1.5fr);
  gap: 18px;
  padding: 16px 20px;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.indigo};
  color: white;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 16px;
  }
`;

export const AtividadeNome = styled.h2`
  margin: 0;
  overflow-wrap: anywhere;
  font: inherit;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
`;

export const AtividadeInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
  line-height: 1.35;
`;

export const DateInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;

  span {
    white-space: nowrap;
  }
`;

export const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const StatusBadge = styled.span<{ $completed?: boolean; $expired?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${({ $completed, $expired }) =>
    $completed ? "#8df0ad" : $expired ? "#ffd1d1" : "white"};
  font-size: 15px;
  font-weight: 800;
`;

export const CheckinForm = styled.form`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CodeInput = styled.input`
  min-width: 150px;
  flex: 1;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 16px;
  outline: none;
  background: white;
  color: ${({ theme }) => theme.colors.primaryDark};
  font: inherit;
  font-weight: 700;

  &:focus {
    border-color: ${({ theme }) => theme.colors.challengeOrange};
  }
`;

export const ActionButton = styled.button<{ $secondary?: boolean }>`
  padding: 8px 16px;
  border: 0;
  border-radius: 18px;
  background: ${({ $secondary, theme }) =>
    $secondary ? theme.colors.white : theme.colors.primaryDark};
  color: ${({ $secondary, theme }) =>
    $secondary ? theme.colors.primaryDark : theme.colors.white};
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.challengeOrange};
    color: white;
    outline: none;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

export const PageState = styled.p<{ $error?: boolean; $success?: boolean }>`
  margin: 0;
  padding: 16px;
  color: ${({ $error, $success, theme }) =>
    $error
      ? theme.colors.challengeOrange
      : $success
        ? "#18753a"
        : theme.colors.primaryDark};
  font-size: 17px;
  font-weight: 700;
  text-align: center;
`;

export const LogoProgete = styled.img`
  position: fixed;
  z-index: 3;
  bottom: 31px;
  left: 52px;
  height: 48px;

  @media (max-width: 768px) {
    bottom: 28px;
    left: 36px;
    height: 30px;
  }
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
