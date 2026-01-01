import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
`;

export const ActivityTitle = styled.div`
  display: flex;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.indigo};
  border: 0;
  color: ${(props) => props.theme.colors.white};
  align-items: center;
  padding: 15px;

  @media (max-width: 320px) {
    width: 27%;
    height: 22px;
    margin-top: 10px;
    margin-left: 5px;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    width: 28%;
    height: 24px;
    margin-top: 10px;
    margin-left: 5px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: 25%;
    height: 32px;
    margin-top: 15px;
    margin-left: 15px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 25%;
    height: 33px;
    margin-top: 15px;
    margin-left: 20px;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    width: 25%;
    height: 36px;
    margin-top: 20px;
    margin-left: 20px;
  }

  @media (min-width: 1281px) {
    width: 25%;
    height: 36px;
    margin-top: 20px;
    margin-left: 20px;
  }
`;

export const ActivityData = styled.div`
  display: flex;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.indigo};
  border: 0;
  color: ${(props) => props.theme.colors.white};
  align-items: center;
  padding: 15px;

  @media (max-width: 320px) {
    width: 67%;
    height: 22px;
    margin-top: 10px;
    margin-left: 5px;
  }

  @media (min-width: 321px) and (max-width: 480px) {
    width: 66%;
    height: 24px;
    margin-top: 10px;
    margin-left: 5px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    width: 65%;
    height: 32px;
    margin-top: 15px;
    margin-left: 10px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 63%;
    height: 33px;
    margin-top: 15px;
    margin-left: 15px;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    width: 61%;
    height: 36px;
    margin-top: 20px;
    margin-left: 20px;
  }

  @media (min-width: 1281px) {
    width: 68%;
    height: 36px;
    margin-top: 20px;
    margin-left: 20px;
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
    font-size: ${(props) => props.theme.fontSize.m16}px;
  }

  @media (min-width: 1281px) {
    font-size: ${(props) => props.theme.fontSize.m16}px;
  }
`;

export const Data = styled.p`
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
    font-size: ${(props) => props.theme.fontSize.m16}px;
  }

  @media (min-width: 1281px) {
    font-size: ${(props) => props.theme.fontSize.m16}px;
  }
`;
