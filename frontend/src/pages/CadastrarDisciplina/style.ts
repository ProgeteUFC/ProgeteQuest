import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh; overflow: hidden; position: relative; color: white;
  background: ${(props) => props.theme.colors.primaryDark}; font-family: "Baloo Paaji 2", sans-serif;
`;
export const Content = styled.main`
  position: relative; z-index: 2; width: min(840px, calc(100% - 48px));
  margin-left: 180px; padding-top: 40px;
  @media (max-width: 768px) { width: calc(100% - 32px); margin: 0 16px; padding-top: 52px; }
`;
export const Title = styled.h1`
  font-family: "Baloo Paaji 2", sans-serif; font-size: 34px; line-height: 1.2; font-weight: 800;
`;
export const Subtitle = styled.h2`
  margin-top: 8px; font-family: "Baloo Paaji 2", sans-serif; font-size: 24px; line-height: 1.2; font-weight: 700;
  @media (max-width: 768px) { br { display: none; } }
`;
export const Form = styled.form`
  width: 100%; margin-top: 30px; display: flex; flex-direction: column; align-items: flex-end;
  @media (max-width: 768px) { align-items: stretch; }
`;
export const NameField = styled.label`
  display: flex; align-items: center; width: 100%; min-height: 82px; padding: 15px 28px;
  border: 10px solid white; border-bottom: 4px solid white; border-radius: 30px 30px 0 0;
  background: ${(props) => props.theme.colors.indigo}; font-family: "Baloo Paaji 2", sans-serif; font-size: 18px; font-weight: 600; line-height: 1;
  strong { white-space: nowrap; }
  input { flex: 1; min-width: 0; border: 0; outline: 0; color: white; background: transparent; font: inherit; }
  input::placeholder { color: #c1c5cd; opacity: 1; font-weight: 200;}
  @media (max-width: 768px) { min-height: 76px; padding: 12px 18px; font-size: 1rem; }
`;
export const DescriptionField = styled.label`
  display: flex; flex-direction: column; width: 100%; height: 220px; padding: 7px 28px 20px;
  border: 10px solid white; border-top: 4px solid white; border-radius: 0 0 30px 30px;
  background: ${(props) => props.theme.colors.indigo}; font-family: "Baloo Paaji 2", sans-serif; font-size: 18px; font-weight: 600; line-height: 1.2;
  > div { display: flex; align-items: baseline; gap: 5px; white-space: nowrap; }
  > div span { color: #c1c5cd; font-weight: 200; }
  textarea { flex: 1; width: 100%; resize: none; border: 0; outline: 0; color: white; background: transparent; font: inherit; }
  textarea::placeholder { color: #c1c5cd; opacity: 1; font-weight: 200;}
  @media (max-width: 768px) { height: 190px; padding: 8px 18px 16px; font-size: 1rem; }
`;
export const CreateButton = styled.button`
  width: 172px; margin-top: 18px; padding: 7px 20px; border: 0; border-radius: 999px;
  color: ${(props) => props.theme.colors.primaryDark}; background: white; font-family: inherit;
  font-size: 16px; font-weight: 800; cursor: pointer; z-index: 3;
  &:hover { background: ${(props) => props.theme.colors.lightOrange}; }
  &:disabled { cursor: wait; opacity: 0.7; }
  @media (max-width: 768px) { align-self: flex-end; }
`;
export const Feedback = styled.p`
  align-self: flex-start; margin: 10px 0 0 16px; color: #ffd1d1; font-size: 1rem;
`;
export const LogoProgete = styled.img`
  position: fixed; z-index: 2; bottom: 31px; left: 52px; height: 48px; width: auto;
  @media (max-width: 768px) { left: 36px; bottom: 28px; height: 30px; }
`;
export const Planet = styled.img`
  position: fixed; z-index: 1; width: 1200px; max-width: 60vw; right: -300px; bottom: -150px; pointer-events: none;
  @media (max-width: 1439px) { display: none; }
`;
