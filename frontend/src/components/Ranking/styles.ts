import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.indigo};
  margin-left: 180px;
  margin-bottom: 55px;
  margin-top: 3px;
  width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  transform: translateY(-90px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding-left: 30px;
`;

export const Position = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Icon = styled.div`
  cursor: pointer;
  svg {
    color: ${(props) => props.theme.colors.white};
    transition: color 0.3s ease-in-out;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;
