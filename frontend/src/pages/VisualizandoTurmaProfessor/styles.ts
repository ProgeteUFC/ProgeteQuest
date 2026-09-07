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

export const Feedback = styled.p<{ $error?: boolean }>`
  margin-top: 10px;
  color: ${(props) => props.$error ? "#ffd1d1" : "#d9ffd9"};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 15px;
  font-weight: 600;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 3, 65, 0.78);
  backdrop-filter: blur(5px);
`;

export const ModalCard = styled.div`
  width: min(460px, 100%);
  max-height: min(620px, 90vh);
  padding: 28px;
  overflow-y: auto;
  border: 8px solid white;
  border-radius: 30px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  box-shadow: 0 24px 70px rgba(15, 0, 55, 0.45);
  font-family: "Baloo Paaji 2", sans-serif;

  h2 { font-size: 28px; text-align: center; }
  > p { margin-top: 10px; text-align: center; }
  > input, > select {
    width: 100%; min-height: 44px; margin-top: 20px; padding: 8px 16px;
    border: 2px solid transparent; border-radius: 22px; outline: none;
    color: ${(props) => props.theme.colors.primaryDark}; background: white;
    font-family: inherit; font-size: 16px;
  }
  > input:focus, > select:focus { border-color: ${(props) => props.theme.colors.lightOrange}; }
  .join-code {
    margin-top: 18px; padding: 12px; border-radius: 18px; color: ${(props) => props.theme.colors.primaryDark};
    background: white; font-size: 24px; font-weight: 800; letter-spacing: 3px; text-align: center;
  }

  @media (max-width: 480px) { padding: 22px 16px; border-width: 6px; border-radius: 24px; }
`;

export const ModalActions = styled.div`
  margin-top: 22px; display: flex; justify-content: flex-end; gap: 10px;
  @media (max-width: 480px) { flex-direction: column-reverse; }
`;

export const CancelButton = styled.button`
  padding: 8px 20px; border: 2px solid white; border-radius: 22px; color: white;
  background: transparent; font-family: inherit; font-weight: 700; cursor: pointer;
  &:hover { background: rgba(255,255,255,.12); }
`;

export const ConfirmButton = styled.button`
  padding: 8px 20px; border: 2px solid white; border-radius: 22px;
  color: ${(props) => props.theme.colors.primaryDark}; background: white;
  font-family: inherit; font-weight: 700; cursor: pointer;
  &:hover { border-color: ${(props) => props.theme.colors.lightOrange}; background: ${(props) => props.theme.colors.lightOrange}; }
`;

export const DangerButton = styled(ConfirmButton)`
  border-color: #e74c3c; color: white; background: #e74c3c;
  &:hover { border-color: #c0392b; background: #c0392b; }
`;

export const DataList = styled.div`
  margin-top: 18px; display: flex; flex-direction: column; gap: 9px;
  > div { padding: 10px 14px; border-radius: 16px; color: ${(props) => props.theme.colors.primaryDark}; background: white; }
  strong, span { display: block; }
  span { color: #666; font-size: 13px; }
  p { text-align: center; }
  button {
    margin-top: 8px; padding: 5px 12px; border: 0; border-radius: 16px;
    color: white; background: ${(props) => props.theme.colors.indigo};
    font-family: inherit; font-weight: 700; cursor: pointer;
  }
  button:hover { background: ${(props) => props.theme.colors.challengeOrange}; }
  .deliveries { border: 3px solid ${(props) => props.theme.colors.lightOrange}; }
  .deliveries span { margin-top: 6px; }
`;

export const FormField = styled.div`
  width: 100%; margin-top: 16px; text-align: left;
  label { display: block; margin: 0 0 5px 8px; color: white; font-size: 15px; font-weight: 700; }
  input, select {
    width: 100%; min-height: 44px; padding: 8px 16px; border: 2px solid transparent;
    border-radius: 22px; outline: none; color: ${(props) => props.theme.colors.primaryDark};
    background: white; font-family: inherit; font-size: 16px;
  }
  input:focus, select:focus { border-color: ${(props) => props.theme.colors.lightOrange}; }
  small { display: block; margin: 5px 8px 0; color: ${(props) => props.theme.colors.muted}; font-size: 12px; }
`;
