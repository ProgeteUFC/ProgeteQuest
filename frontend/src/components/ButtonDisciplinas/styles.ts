import styled from "styled-components";

export const ButtonContainer = styled.button`
  display: flex;

  color: white;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.indigo};
  border: 0;
  color: ${(props) => props.theme.colors.white};
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  @media (max-width: 320px) {
    width: 90%;
    height: 22px;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    width: 90%;
    height: 24px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: 90%;
    height: 28px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 90%;
    height: 36px;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    width: 90%;
    height: 36px;
  }

  @media (min-width: 1281px) {
    width: 90%;
    height: 36px;
  }
`;

export const Title = styled.p`
  @media (max-width: 320px) {
    font-size: ${(props) => props.theme.fontSize.p10}px;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    font-size: ${(props) => props.theme.fontSize.p12}px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    font-size: ${(props) => props.theme.fontSize.p14}px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: ${(props) => props.theme.fontSize.p14}px;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    font-size: ${(props) => props.theme.fontSize.p14}px;
  }

  @media (min-width: 1281px) {
    font-size: ${(props) => props.theme.fontSize.p14}px;
  }
`;
