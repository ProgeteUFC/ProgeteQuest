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

export const Text = styled.p`
  max-width: 760px;
  margin: 8px 0 0;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
`;

export const SearchContainer = styled.form`
  display: flex;
  width: min(600px, 100%);
  min-height: 60px;
  align-items: center;
  margin-top: 56px;
  padding: 0 14px 0 22px;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    margin-top: 36px;
  }
`;

export const Pesquisa = styled.input`
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  font: inherit;
  font-size: 18px;
  font-weight: 700;

  &::placeholder {
    color: ${({ theme }) => theme.colors.indigo};
    opacity: 1;
  }
`;

export const IconeBusca = styled.button`
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 30px;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.challengeOrange};
    outline: none;
  }

  &:active {
    transform: scale(0.94);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;

export const Feedback = styled.p<{ $success?: boolean }>`
  width: min(600px, 100%);
  margin: 10px 0 0;
  color: ${({ $success }) => ($success ? "#8df0ad" : "#ffd1d1")};
  font-size: 17px;
  font-weight: 700;
`;

export const Image = styled.img`
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
