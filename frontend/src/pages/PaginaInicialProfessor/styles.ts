import styled from "styled-components";

const mobilePrototype = `@media ((max-width: 410px) and (max-height: 900px)), (min-width: 1024px) and (max-width: 1024px) and (max-height: 900px)`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  
  ${mobilePrototype} {
    padding: 0;
    min-height: 874px;
    height: 100vh;
  }
`;

export const Content = styled.div`
  padding: 40px 4vw 0 4vw;
  max-width: 1000px;
  margin-top: 2.5vw;
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
    margin-left: 8vw;
    width: 84vw;
    max-width: 1200px;
  }

  @media (max-width: 1439px) {
    width: min(900px, calc(100% - 48px));
    max-width: 900px;
    margin: 32px auto 0;
    padding: 32px 24px 60px;
    align-items: center;
  }

  /* TABLET */
  @media (max-width: 1024px) {
    padding: 24px 2vw 24px 2vw;
    margin-top: 12px;
    align-items: center;
  }
  /* MOBILE */
  @media (max-width: 768px) {
    padding: 5px 5vw 30px 5vw;
    margin-top: 5px;
    align-items: flex-start;
  }
  
  ${mobilePrototype} {
    padding: 0 0 0 0;
    margin-top: 0;
    align-items: center;
    justify-content: flex-start;
    min-height: 700px;
  }
`;

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  justify-content: center;
  position: relative;
  ${mobilePrototype} {
    justify-content: space-between;
    padding: 0 8px;
    height: 60px;
    min-height: 60px;
    gap: 0;
}
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
  
  ${mobilePrototype} {
    margin-top: 32px;
    margin-bottom: 0;
    padding: 0;
    height: auto;
    width: 100%;
    background: transparent;
    justify-content: center;
  }
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 2vw;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  gap: 2vw;

  /* MOBILE */
  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    background: transparent;
    padding: 0;
    width: 100%;
  }
  
  ${mobilePrototype} {
    gap: 12px;
    padding: 0 0 0 0;
    border-radius: 0;
    width: 100%;
    background: transparent;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0 auto;
    max-width: 340px;
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
  
  ${mobilePrototype} {
    width: 100%;
    height: 70px;
    font-size: 18px;
    border-radius: 16px;
    padding: 0 2px;
    gap: 10px;
    margin: 0;
    box-shadow: none;
  }
`;

export const PlanetImage = styled.img`
  position: fixed;
  pointer-events: none;
  z-index: 1;

  /* DESKTOP */
  @media (min-width: 1025px) {
    width: 1200px;
    bottom: -150px;
    right: -300px;
    max-width: 60vw;
  }
  
  ${mobilePrototype} {
    // width: 480px;
    right: -105px;
    bottom: 0px;
    max-width: 90vw;
    min-width: 110vw;
  }

  @media (max-width: 1439px) {
    display: none;
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
  @media (max-width: 1024px) {
    margin-top: 24px;
    max-width: 90vw;
    gap: 12px;
  }
  @media (max-width: 768px) {
    margin-top: 18px;
    max-width: 320px;
    gap: 10px;
  }
  
  ${mobilePrototype} {
    margin-top: 24px;
    max-width: 320px;
    gap: 10px;
    align-items: center;
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
  @media (max-width: 1024px) {
    font-size: 16px;
    line-height: 1.3;
  }
  
  ${mobilePrototype} {
    font-size: 15px;
    line-height: 1.2;
    text-align: left;
    font-weight: 600;
  }
`;

export const LogoImage = styled.img`
  width: 100px;
  height: 60px;
  object-fit: contain;
  ${mobilePrototype} {
    width: 100px;
    height: 60px;
  }
`;

