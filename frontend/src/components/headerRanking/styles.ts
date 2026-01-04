import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 115px;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  padding: 20px;
  justify-content: space-between;
`;

export const Box = styled.div`
  gap: 15px;
  display: flex;
`;

export const Image = styled.img`
  display: flex;
  width: 203px;
  height: 83px;
  align-items: center;
`;

export const IconHome = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  svg {
    color: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;

export const IconExite = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
  gap: 5px;

  span {
    font-family: "Codec Pro", sans-serif;
    font-size: 13px;
    font-weight: 400;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
    span {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;
