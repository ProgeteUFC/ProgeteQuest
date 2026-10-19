import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh; overflow: hidden; position: relative; color: white;
  background: ${(props) => props.theme.colors.primaryDark}; font-family: "Baloo Paaji 2", sans-serif;
`;
export const Content = styled.main`
  position: relative; z-index: 2; width: min(840px, calc(100% - 48px));
  margin-left: 180px; padding: 40px 0 110px;
  @media (max-width: 1024px) { width: min(700px, calc(100% - 48px)); margin: 0 auto; }
  @media (max-width: 768px) { width: calc(100% - 32px); margin: 0 16px; padding-top: 52px; }
`;
export const Title = styled.h1`
  font-family: "Baloo Paaji 2", sans-serif; font-size: 34px; line-height: 1.2; font-weight: 800;
`;
export const Subtitle = styled.h2`
  margin-top: 8px; font-family: "Baloo Paaji 2", sans-serif; font-size: 24px; line-height: 1.2; font-weight: 700;
  @media (max-width: 768px) { font-size: 20px; br { display: none; } }
`;
export const Form = styled.form`
  width: min(640px, 100%); margin-top: 30px; padding: 28px;
  display: flex; flex-direction: column; gap: 22px;
  border-radius: 30px; background: white;
  color: ${(props) => props.theme.colors.primaryDark};
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
  @media (max-width: 768px) { padding: 22px 18px; border-radius: 24px; }
`;
export const NameField = styled.label`
  display: flex; flex-direction: column; gap: 8px; width: 100%; min-width: 0;
  font-family: inherit; font-size: 18px; font-weight: 700; line-height: 1.4;
  input, select {
    width: 100%; min-width: 0; min-height: 48px; padding: 10px 14px;
    border: 2px solid ${(props) => props.theme.colors.indigo}; border-radius: 14px;
    color: ${(props) => props.theme.colors.primaryDark}; background: white;
    font: inherit; font-size: 16px; font-weight: 500;
  }
  input:focus-visible, select:focus-visible { outline: 3px solid ${(props) => props.theme.colors.lightOrange}; outline-offset: 2px; }
  input:disabled, select:disabled { opacity: .65; cursor: not-allowed; }
  input::placeholder { color: #666; opacity: 1; }
  p { margin: 0; font-size: 14px; font-weight: 500; }
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
  align-self: flex-end; min-width: 172px; min-height: 44px; padding: 10px 24px; border: 0; border-radius: 999px;
  color: white; background: ${(props) => props.theme.colors.indigo}; font-family: inherit;
  font-size: 16px; font-weight: 800; cursor: pointer; z-index: 3;
  &:hover:not(:disabled) { background: ${(props) => props.theme.colors.primaryDark}; }
  &:focus-visible { outline: 3px solid ${(props) => props.theme.colors.lightOrange}; outline-offset: 3px; }
  &:disabled { cursor: wait; opacity: 0.7; }
  @media (max-width: 768px) { align-self: flex-end; }
`;
export const Feedback = styled.p`
  align-self: flex-start; margin: 0; color: ${(props) => props.theme.colors.error}; font-size: 1rem;
`;
export const LogoProgete = styled.img`
  position: fixed; z-index: 2; bottom: 31px; left: 52px; height: 48px; width: auto;
  @media (max-width: 768px) { left: 36px; bottom: 28px; height: 30px; }
`;
export const Planet = styled.img`
  position: fixed; z-index: 1; width: 1200px; max-width: 60vw; right: -300px; bottom: -150px; pointer-events: none;
  @media (max-width: 1439px) { display: none; }
`;
