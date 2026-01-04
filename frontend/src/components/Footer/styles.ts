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
`;
export const Image = styled.img`
  width: 200px;
  height: 56px;
  margin-top: 50px;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 5px;
`;
