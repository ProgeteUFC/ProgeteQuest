import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 84.3vh; //REFERÊNCIA - JÁ CONTA COM O ESPAÇO DA HEADER
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  overflow: hidden;

  @media (max-width: 768px) {
    overflow-y: auto;
    padding: 1rem;
    align-items: flex-start;
    height: auto;
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

  /* RESPONSIVIDADE: TABLET/LAPTOP PEQUENO */
  @media (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    margin-top: 4rem;
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

  /* --- RESPONSIVIDADE: CELULAR --- */
  @media (max-width: 768px) {
    margin-left: 0;
    max-width: 100%;
    width: 100%;

    .button-group-vertical {
      align-items: center; /* Centraliza botões no mobile */
    }
  }
`;

export const HeaderContainer = styled.div`
  color: ${({ theme }) => theme.colors.white};

  .title-wrapper {
    display: flex;
    align-items: center;

    font-family: "Baloo Paaji 2", sans-serif;
  }

  .subtitle {
    font-family: "Baloo Paaji 2", sans-serif;
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    font-weight: 800;
    padding-top: 1px;
    padding-bottom: 10px;

    line-height: 1.2;
    margin-bottom: 0.2rem;

    span {
      color: #00ffb3;
      font-weight: bold;
    }
  }

  /* RESPONSIVIDADE: CELULAR */
  @media (max-width: 768px) {
    text-align: center;

    .title-wrapper {
      justify-content: center;
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
    transform: translateX(-50%); /* Centraliza no topo */
    top: 1.5rem;
    height: 40px;
  }
`;

export const LogoBottom = styled.img`
  position: absolute;
  left: 2rem;
  bottom: 0.7rem;
  height: 48px;

  @media (max-width: 768px) {
    /* No celular, removemos position absolute para não cobrir o formulário */
    position: relative;
    left: 0;
    bottom: 0;
    margin-top: 3rem;
    margin-bottom: 1rem;
    align-self: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const PersonalData = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 0.8rem 1.5rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);

  form {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
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
`;

export const SaveButton = styled.button`
  background-color: ${(props) => props.theme.colors.white};
  color: ${(props) => props.theme.colors.kingfisherDaisy};
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 4px 0;
  width: 160px;
  margin-top: 10px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const Image = styled.img`
  // REFERÊNCIA - IMAGEM DO PLANETA AZUL CLARO
  position: fixed;
  width: 700px;
  bottom: 0;
  right: 0;
  transform: translate(20%, 20%);

  @media (max-width: 1400px) {
    width: 500px;
    transform: translate(10%, 10%);
  }

  @media (max-width: 768px) {
    width: 400px;
    transform: translate(10%, 10%);
  }
`;
