import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    overflow-y: auto;
    padding: 1rem;
    align-items: flex-start;
    height: auto;
    min-height: 100dvh;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  z-index: 1;

  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    margin-top: 4rem;
  }

  @media (max-width: 768px) {
    max-width: 402px; /* Força a adaptação ao formato mobile solicitado */
    margin-top: 5rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  max-width: 600px;
  margin-left: 4rem;

  .button-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    align-items: flex-end;
    width: 100%;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    max-width: 100%;
    width: 100%;

    .button-group-vertical {
      align-items: center;
      margin-top: 1.5rem;
    }
  }
`;

export const HeaderContainer = styled.div`
  color: ${({ theme }) => theme.colors.white};
  margin-top: 1rem;

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0;
    font-family: "Baloo Paaji 2", sans-serif;
  }

  .subtitle {
    font-family: "Baloo Paaji 2", sans-serif;
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    font-weight: 800;
    padding-bottom: 10px;
    line-height: 1.2;
    margin-bottom: 0.2rem;

    span {
      color: #00ffb3;
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: 1rem;

    .title-wrapper {
      justify-content: center;
    }
    .subtitle {
      font-size: 18px; /* Ajuste para caber nos 402px */
      padding-bottom: 0;
    }
  }
`;

export const LogoTop = styled.img`
  position: absolute;
  left: 2rem;
  top: 2rem;
  height: 48px;

  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    top: 1.5rem;
    height: 40px;
  }
`;

/* Escondido apenas no mobile */
export const LogoBottom = styled.img`
  position: absolute;
  left: 2rem;
  bottom: 0.7rem;
  height: 48px;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* Escondido apenas no mobile */
export const Planet = styled.img`
  position: absolute;
  right: 2rem;
  top: 2rem;
  height: 200px;
  width: 380px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Register = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.7rem 1.5rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);

  form {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.2rem;
    form {
      gap: 0.6rem; /* Mais espaço vertical para o toque */
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #4a4385;
  padding: 0 1rem;
  border-radius: 1rem;
  height: 36px;
  width: 100%;
  border: 2px solid transparent;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary || "#00ffb3"};
  }

  label {
    color: #fff;
    font-weight: 500;
    white-space: nowrap;
    margin-right: 0.5rem;
    font-family: "Codec Pro", sans-serif;
    font-size: 14px;
  }

  input {
    background: transparent;
    border: none;
    color: ${(props) => props.theme.colors.lightOrange};
    width: 100%;
    font-family: "Codec Pro", sans-serif;
    font-size: 14px;
    font-weight: 300;
    height: 100%;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: red;
      font-family: "Codec Pro", sans-serif;
    }
  }

  @media (max-width: 768px) {
    height: 48px; /* Padrão mínimo de touch target mobile */
    input {
      font-size: 16px; /* Evita zoom automático no iOS */
    }
  }
`;

/* Escondido apenas no mobile */
export const RightArtwork = styled.img`
  width: 450px;
  height: auto;
  object-fit: contain;
  margin-top: 4rem;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const CadastrarButton = styled.button`
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 4px 0;
  width: 160px;
  margin-top: 5px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }

  @media (max-width: 768px) {
    width: 100%; /* Largura total para facilitar o clique */
    height: 48px;
    font-size: 18px;
    padding: 0;
  }
`;

export const UserTypeRow = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  background: #4f4192;
  border-radius: 24px;
  padding: 6px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const UserTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  border-radius: 24px;
  background: ${({ active }) => (active ? "#fff" : "transparent")};
  color: ${({ active }) => (active ? "#2c0383" : "#fff")};
  font-weight: bold;
  font-size: 1.1rem;
  padding: 4px 0;
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  box-shadow: none;
  transition: background 0.2s, color 0.2s;
  outline: none;
  margin: 0;
  font-family: "Baloo Paaji 2", sans-serif;
  letter-spacing: 0.01em;
  
  &:not(:last-child) {
    border-right: 2px solid transparent;
  }
  &.active {
    background: #fff;
    color: #2c0383;
    font-weight: 700;
  }
  &:hover:not(.active) {
    background: rgba(255,255,255,0.18);
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 8px 0; /* Maior área de toque */
    font-size: 1rem;
  }
`;