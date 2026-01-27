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
  font-size: ${(props) => props.theme.fontSize.g34}px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 700;

`;
export const Text = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.g24}px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 700;
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
  font-size: 18px;
  background: #fff;
  color: #2c0383;
  font-family: "Codec Pro", sans-serif;
  padding: 20px;

  &::placeholder {
    color: #4f4192;
    opacity: 1;
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
