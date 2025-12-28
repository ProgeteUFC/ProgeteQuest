import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NumberAndSuffix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Number = styled.div`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.g60}px;
  font-weight: bold;
`;

export const Atividade = styled.div`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.p14}px;
  transform: translateY(+10px);
`;

export const Suffix = styled.div`
  color: ${(props) => props.theme.colors.white};
  font-size: ${(props) => props.theme.fontSize.p10}px;
  transform: translateY(+10px);
  font-weight: bold;
`;
