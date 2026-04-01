import styled from "styled-components";

export const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  min-height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center; /* central vertical */
  align-items: center;     /* central horizontal */

  padding: 2rem;
`;

export const Container = styled.div`
font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  font-family: "Baloo Paaji 2", sans-serif;

  margin: 0;
  padding-top: 2rem;
`;