import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const Content = styled.div`
  padding: 40px 20px 0 20px;
  max-width: 900px;
  margin-top: 25px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px;

  position: relative;
  z-index: 2;
  & > h1, 
  & [class*="Title"] {
    font-family: "Baloo Paaji 2", sans-serif !important;
  }

  @media (min-width: 1024px) {
    align-items: flex-start;
    margin-left: 10%;
    width: 80%;
    max-width: 1200px;
  }

  /* MOBILE */
  @media (max-width: 768px) {
    padding: 5px 50px 30px 20px;
    margin-top: 5px;
    align-items: flex-start;
    
  }
`;

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  justify-content: flex-start;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
  padding: 0 8px;
  gap: 12px;
  height: 120px;
  border-radius: 20px;

  /* MOBILE */
  @media (max-width: 768px) {
    background: transparent;
    padding: 0;
    height: auto;
    width: 100%;
    font-family: "Baloo Paaji 2", sans-serif;
  }
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 12px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  gap: 20px;

  /* MOBILE */
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    background: transparent;
    padding: 0;
    width: 100%;
  }
`;

export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  color: white;
  align-items: center;
  border-radius: 20px;
  padding: 1px 0px;
  height: 60px;
  width: 150px;
  justify-content: center;
  gap: 25px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  font-size: 18px;
  text-align: center;
  font-family: "Baloo Paaji 2", sans-serif;

  &:active {
    scale: 0.97;
    transition-duration: 100ms;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }

  /* MOBILE */
  @media (max-width: 768px) {
    width: 100%;
    height: 80px;
    border-radius: 20px;
    font-size: 20px;
    line-height: 1.2;
    padding: 10px;
  }
`;

export const PlanetImage = styled.img`
  position: fixed;
  pointer-events: none;
  z-index: 1;

  /* MOBILE */
  @media (max-width: 768px) {
    width: 250px;
    bottom: -20px;
    right: -60px;
  }

  /* DESKTOP */
  @media (min-width: 1025px) {
    width: 1200px;
    bottom: -150px;
    right: -300px;
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
  max-width: 600px;
  font-family: "Baloo Paaji 2", sans-serif;

  /* MOBILE */
  @media (max-width: 768px) {
    margin-top: 30px;
    max-width: 320px;
    gap: 16px;
  }
`;

export const DescriptionText = styled.p`
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
  margin: 0;

  /* MOBILE */
  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.3;
  }
`;