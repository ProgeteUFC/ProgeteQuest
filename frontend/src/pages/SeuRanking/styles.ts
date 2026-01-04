import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
`;

export const Content = styled.div`
  width: 100%;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 54px;
  max-width: 1120px;
`;

export const Title = styled.h2`
  margin-left: 180px;
  font-family: "Baloo Paaji 2", sans-serif;
  color: ${(props) => props.theme.colors.white};
  font-size: 34px;
  transform: translateY(-90px);
`;

export const Image = styled.img`
  position: fixed;
  width: 650px;
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
