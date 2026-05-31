import styled, { createGlobalStyle } from 'styled-components';

export const NoScroll = createGlobalStyle`
  html, body {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
    width: 100vw;
    height: 100vh;
    position: relative;
  }
`;
const mobilePrototype = `@media ((max-width: 410px) and (max-height: 900px)), (min-width: 1024px) and (max-width: 1024px) and (max-height: 900px)`;

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  min-height: 84.3vh;
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden !important;
  @media (max-width: 768px) {
    height: 100vh;
    min-height: unset;
  }
`;

export const Content = styled.main`
  padding: 18px 4vw 0 4vw;
  max-width: 1000px;
  margin-top: 0.5vw;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
`;

export const HeaderInfo = styled.div`
  margin-bottom: 18px;
  z-index: 2;
  font-family: "Baloo Paaji 2", sans-serif;
  text-align: left;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    margin-top: 5px;
    font-size: 1.25rem;
    font-weight: 500;
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    text-align: left;
    width: 100%;
    padding-left: 8px;
  }
`;

export const DashboardGrid = styled.div`
  display: flex;
  gap: 30px;
  z-index: 2;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
  @media (width: 1024px) and (height: 874px),
         (width: 768px) and (height: 874px),
         (width: 425px) and (height: 874px) {
    display: none !important;
  }
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 18px;
    width: 100%;
    align-items: stretch;
    min-width: 0;
  }
`;

export const ActionCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 18px 4px;
    box-shadow: none;
    background: transparent;
  }
  @media (max-width: 425px) {
    padding: 10px 2px;
    gap: 10px;
  }
`;

export const ActionButton = styled.button`
  background-color: #5A4B81;
  color: #FFFFFF;
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin: 0 auto;

  &:hover {
    background-color: #453965;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 13px 8px;
    width: 100%;
    margin-bottom: 10px;
  }
`;

export const RankingCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 30px 18px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);

  @media (width: 1024px) {
    margin-left: 250px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const RankingItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
  gap: 15px;

  .badge {
    background-color: #2D0B5A;
    color: #FFFFFF;
    font-weight: bold;
    font-size: 1rem;
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 45px;
    @media (max-width: 768px) {
      font-size: 0.95rem;
      min-width: 36px;
      padding: 7px 8px;
    }
  }

  .name {
    color: #333333;
    font-weight: bold;
    font-size: 1rem;
    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }
`;




export const PlanetImage = styled.img`
  position: fixed;
  pointer-events: none;
  z-index: 1;
  @media (width: 1024px) and (height: 874px),
         (width: 768px) and (height: 874px),
         (max-width: 426px) and (height: 874px),
         (width: 425px) and (height: 874px) {
    display: none !important;
    visibility: hidden !important;
  }
  /* DESKTOP */
  @media (min-width: 1025px) {
    width: 1200px;
    bottom: -150px;
    right: -300px;
    max-width: 60vw;
  }
  ${mobilePrototype} {
    right: -105px;
    bottom: 0px;
    max-width: 90vw;
    min-width: 110vw;
  }
`;

export const AstronautImage = styled.img`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 90px;
  pointer-events: none;
  @media (width: 1024px) and (height: 874px),
         (width: 768px) and (height: 874px),
         (max-width: 426px) and (height: 874px),
         (width: 425px) and (height: 874px) {
    display: none !important;
    visibility: hidden !important;
  }
  display: none;
  ${mobilePrototype} {
    display: block;
    height: 45vw;
    width: 28vw;
    margin-left: -17vw;
    bottom: 18vw;
    min-width: 300px;
    max-width: 350px;
  }
`;

export const Estrelas = styled.div`
  display: flex;
  justify-content: center;
`;