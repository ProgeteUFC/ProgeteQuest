import styled from "styled-components";

const mobilePrototype = `@media ((max-width: 410px) and (max-height: 900px)), (min-width: 1024px) and (max-width: 1024px) and (max-height: 900px)`;

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
`;
export const Image = styled.img`
  // REFERÊNCIA - IMAGEM DA LOGO DO PROGETE
  position: absolute;
  left: 2rem;
  bottom: 0.7rem;
  height: 48px;

  ${mobilePrototype} {
    left: 1rem;
    bottom: 0.5rem;
    height: 30px;
    margin-left: -5px;
  }
`;

export const Text = styled.p`
  color: ${(props) => props.theme.colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 5px;
`;
