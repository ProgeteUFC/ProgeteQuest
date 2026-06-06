import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 20px;
  font-size: 14px;
  margin-top: 30px;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 130px;
  z-index: 1;

  // Para mobile (402 x 874)
  @media (max-width: 768px) {
    height: 100px;  // Opcional: diminuir altura do container
    padding: 10px;
  }
`;

export const Image = styled.img`
  // REFERÊNCIA - IMAGEM DA LOGO DO PROGETE
  position: absolute;
  left: 2rem;
  bottom: 0.7rem;
  height: 48px;

  // Para mobile (402 x 874) - diminui a logo
  @media (max-width: 768px) {
    height: 32px;  // Diminui de 48px para 32px
    left: 1rem;    // Ajusta a posição esquerda
    bottom: 0.5rem;
  }
`;

export const Text = styled.p`
  color: ${(props) => props.theme.colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 5px;

  // Para mobile
  @media (max-width: 768px) {
    font-size: 12px;  // Opcional: diminuir fonte
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;