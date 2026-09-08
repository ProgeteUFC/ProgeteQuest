import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  align-items: center;
  justify-content: center;
  padding: 88px 32px 72px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.kingfisherDaisy};
  font-family: "Baloo Paaji 2", sans-serif;

  @media (max-width: 1439px) {
    align-items: flex-start;
    padding-top: 110px;
    overflow-y: auto;
  }

  @media (max-width: 600px) {
    padding: 88px 16px 28px;
  }
`;

export const PageContent = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1200px, 100%);
  grid-template-columns: minmax(420px, 600px) minmax(300px, 1fr);
  align-items: center;
  gap: clamp(45px, 8vw, 120px);

  @media (max-width: 1439px) {
    display: block;
    width: min(600px, 100%);
  }
`;

export const LeftColumn = styled.section`
  width: 100%;

  .button-group-vertical {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 14px;
  }

  @media (max-width: 600px) {
    .button-group-vertical {
      flex-direction: column-reverse;
      justify-content: stretch;
    }
  }
`;

export const HeaderContainer = styled.header`
  margin-bottom: 14px;
  color: white;

  .title-wrapper p {
    margin: 0;
  }

  .subtitle {
    margin: 8px 0 0;
    color: white;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.2;
  }

  @media (max-width: 600px) {
    text-align: center;

    .title-wrapper {
      display: flex;
      justify-content: center;
    }

    .subtitle {
      font-size: 18px;
    }
  }
`;

export const Register = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 12px 35px rgba(22, 4, 68, 0.25);

  form {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  @media (max-width: 600px) {
    padding: 18px 14px;
    border-radius: 24px;
  }
`;

export const InputWrapper = styled.label`
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  padding: 0 16px;
  border: 2px solid transparent;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.indigo};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.challengeOrange};
  }

  > span,
  > label {
    flex: 0 0 auto;
    margin-right: 6px;
    color: white;
    font: inherit;
    font-size: 15px;
    font-weight: 800;
    white-space: nowrap;
  }

  input {
    min-width: 0;
    min-height: 38px;
    flex: 1;
    border: 0;
    outline: none;
    background: transparent;
    color: white;
    font: inherit;
    font-size: 15px;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    min-height: 48px;
    padding: 0 12px;

    > span,
    > label,
    input {
      font-size: 14px;
    }
  }
`;

export const UserTypeRow = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  margin-bottom: 14px;
  padding: 5px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.indigo};
`;

export const UserTypeButton = styled.button<{ $active: boolean }>`
  min-height: 38px;
  flex: 1;
  padding: 5px 8px;
  border: 0;
  border-radius: 20px;
  outline: none;
  background: ${({ $active }) => ($active ? "white" : "transparent")};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryDark : theme.colors.white};
  font: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled),
  &:focus-visible {
    background: ${({ $active }) =>
      $active ? "white" : "rgba(255, 255, 255, 0.18)"};
  }
`;

export const CadastrarButton = styled.button`
  width: 170px;
  min-height: 38px;
  padding: 5px 18px;
  border: 0;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.indigo};
  color: white;
  font: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.challengeOrange};
    outline: none;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  @media (max-width: 600px) {
    width: 100%;
    min-height: 46px;
  }
`;

export const LoginButton = styled(CadastrarButton)`
  width: 170px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const Feedback = styled.p<{ $success?: boolean }>`
  margin: 8px 4px 0;
  color: ${({ $success }) => ($success ? "#18753a" : "#c62828")};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
`;

export const LogoTop = styled.img`
  position: absolute;
  z-index: 5;
  top: 28px;
  left: 32px;
  height: 48px;

  @media (max-width: 600px) {
    top: 22px;
    left: 50%;
    height: 38px;
    transform: translateX(-50%);
  }
`;

export const LogoBottom = styled.img`
  position: absolute;
  z-index: 3;
  bottom: 20px;
  left: 32px;
  height: 42px;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const Planet = styled.img`
  position: absolute;
  z-index: 1;
  top: 60px;
  right: 73px;
  width: 410px;
  pointer-events: none;

  @media (max-width: 1439px) {
    width: 250px;
    display: none;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

export const RightArtwork = styled.img`
  width: min(480px, 100%);
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.2));

  @media (max-width: 1439px) {
    display: none;
  }
`;
