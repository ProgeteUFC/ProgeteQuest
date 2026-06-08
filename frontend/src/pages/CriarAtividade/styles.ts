import styled, { createGlobalStyle } from 'styled-components';

export const NoScroll = createGlobalStyle`
  html, body {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
    width: 100vw;
    height: 100vh;
    position: relative;
  }
`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy}; /* 1. Corrigido para a cor exata do tema */
  min-height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden !important;
  /* Removido o align-items: center daqui para o Header não ficar cortado (Erro 2 resolvido) */
`;

export const Content = styled.main`
  padding: 60px 4vw 0 4vw;
  max-width: 1000px;
  margin: 0 auto; /* Centraliza apenas o conteúdo do meio, deixando o Header livre */
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-family: "Baloo Paaji 2", sans-serif; /* 3. Fonte corrigida para puxar a família certa */
  font-size: 34px;
  color: #FFFFFF;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: left;
`;

export const FormCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 40px 50px;
  display: flex;
  gap: 40px;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 2;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`;

export const TypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 5px;
`;

export const Label = styled.span`
  font-family: 'Codec Pro', sans-serif;
  font-size: 14px;
  color: #1A0B42;
  font-weight: bold;
`;

export const TypeButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

export const TypeButton = styled.button`
  background-color: #FFFFFF;
  border: 2px solid #5A4B81;
  color: #5A4B81;
  border-radius: 20px;
  padding: 6px 18px;
  font-family: 'Codec Pro', sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(90, 75, 129, 0.1);
  }

  &.active {
    background-color: #5A4B81;
    color: #FFFFFF;
  }
`;

export const InputItem = styled.input`
  background-color: #5A4B81;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  padding: 14px 20px; /* Aumentei um pouco o padding para ficar mais próximo do protótipo */
  width: 100%;
  font-family: 'Codec Pro', sans-serif;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #FFFFFF;
    opacity: 1;
    font-weight: normal;
  }
`;

export const TextAreaItem = styled.textarea`
  background-color: #5A4B81;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  width: 100%;
  height: 200px;
  font-family: 'Codec Pro', sans-serif;
  font-size: 14px;
  resize: none;
  outline: none;

  &::placeholder {
    color: #FFFFFF;
    opacity: 1;
    font-weight: normal;
  }
`;

export const SubmitButton = styled.button`
  background-color: #E58E26;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  padding: 12px 45px;
  font-family: 'Codec Pro', sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

/* 4. Planeta com as métricas exatas resgatadas do seu código original */
export const PlanetImage = styled.img`
  position: fixed;
  pointer-events: none;
  z-index: 1;
  
  @media (min-width: 1025px) {
    width: 1200px;
    bottom: -150px;
    right: -300px;
    max-width: 60vw;
  }
  
  @media (max-width: 1024px) {
    width: 800px;
    bottom: -100px;
    right: -200px;
  }
`;