export const BackButtonNotFound = styled.button`
  background: #6C63FF;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 24px;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 1003;
  pointer-events: auto;

  &:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
  }
`;
import styled from "styled-components";

export const BackButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  position: relative;
  z-index: 1002;
  pointer-events: auto;
`;

export const BackButton = styled.button`
  background: #6C63FF;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 1003;
  pointer-events: auto;

  &:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
  }
`;
