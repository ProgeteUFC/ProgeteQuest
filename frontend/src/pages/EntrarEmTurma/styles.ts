import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

export const Content = styled.div`
  width: 100%;
  padding: 200px;
  max-width: 1120px;
`;

export const Title = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.g45}px;
`;
export const Text = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.g34}px;
  padding-bottom: 20px;
`;

export const Image = styled.img`
  position: fixed;
  width: 700px;
  z-index: 0;
  bottom: 0;
  right: 0;
  transform: translate(20%, 20%);
`;

export const Pesquisa = styled.input`
  width: 600px;
  height: 60px;
  border-radius: 40px;
  font-size: 24px;
  padding: 20px;

  &::placeholder {
    color: ${(props) => props.theme.colors.indigo};
    opacity: 1;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 600px;
  height: 60px;
  display: flex;
  align-items: center;
`;

export const IconeBusca = styled.div`
  position: absolute;
  color: ${(props) => props.theme.colors.kingfisherDaisy};
  right: 25px;
  top: 16px;
  cursor: pointer;
  font-size: 30px;
  z-index: 10;
  &&:hover {
    color: ${(props) => props.theme.colors.lightOrange};
  }
`;
