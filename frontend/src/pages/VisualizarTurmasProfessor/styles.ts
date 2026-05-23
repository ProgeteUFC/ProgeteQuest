import styled from 'styled-components';

export const PageWrapper = styled.div`
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
`;

export const ProgeteLogoFull = styled.img`
  position: fixed;
  width: 700px;
  z-index: 0;
  bottom: 0;
  left: 0;
  transform: translate(-20%, 20%);
  pointer-events: none;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const PlanetOrange = styled.img`
  position: fixed;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 0;
  
  @media (max-width: 768px) {
    display: none !important;
  }
  
  @media (min-width: 1025px) {
    display: block;
    width: 1200px;
    bottom: -150px;
    right: -300px;
    transform: translate(5%, 5%);
  }
`;

export const FixedLogo = styled.img`
  position: fixed;
  left: 32px;
  bottom: 32px;
  width: 120px;
  height: auto;
  z-index: 10;
  pointer-events: none;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const ViewClassesBg = styled.div`
  height: 84.3vh;
  background: #2e008b;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden !important;
    overflow-y: auto;
    
    & > :not(:first-child) {
      display: none !important;
    }
  }
`;

export const ViewClassesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 2;
  margin-top: 40px;
  padding-left: 180px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
    align-items: center;
    text-align: center;
    max-width: 100vw;
    overflow-x: hidden;
  }
`;

export const Title = styled.h1`
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  font-family: 'Baloo Paaji 2', sans-serif;
  margin-bottom: 0.5rem;
  margin-left: 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 28px;
    text-align: center;
    width: 100%;
  }
`;

export const Subtitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Baloo Paaji 2', sans-serif;
  margin-bottom: 2.5rem;
  line-height: 1.2;
  margin-left: 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 18px;
    text-align: center;
    width: 100%;
    margin-bottom: 2rem;
  }
`;

export const ListaTurmas = styled.div`
  background: #fff;
  border-radius: 32px;
  padding: 22px 16px;
  width: 400px;
  max-height: 342px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-left: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 340px;
    padding: 16px;
    margin: 0 auto;
  }
`;

export const ListaTurmasScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 20px;
  max-height: 298px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 5px;
  scrollbar-width: thin;
  scrollbar-color: #fff #4f4192;
  
  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 32px;
    background: #fff;
  }
  &::-webkit-scrollbar-thumb {
    background: #4f4192;
    border-radius: 32px;
  }
`;

export const TurmaCard = styled.div`
  background: #4f4192;
  border-radius: 20px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: 'Baloo Paaji 2', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  box-sizing: border-box;
  
  &:hover,
  &:focus {
    background: #f97316;
    color: #fff;
    outline: none;
  }
`;

export const TurmaNome = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  word-break: break-word;
`;

export const PlanetIllustration = styled.div`
  position: fixed;
  width: 1100px;
  height: 1100px;
  right: -265px;
  bottom: -350px;
  background: url('/src/assets/planeta_amarelo.png') no-repeat center/contain;
  z-index: 1;
  pointer-events: none;
  max-width: 100vw;

  @media (max-width: 1400px) {
    width: 800px;
    height: 800px;
    bottom: -80px;
    transform: translate(5%, 10%);
  }
  
  @media (max-width: 768px) {
    display: none !important;
  }
`;