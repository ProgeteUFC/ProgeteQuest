import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: white;
  background: ${(props) => props.theme.colors.primaryDark};
  font-family: "Baloo Paaji 2", sans-serif;

  @media (max-width: 768px) {
    min-height: 100dvh;
    overflow-y: auto;
  }
`;

export const PageContent = styled.main`
  position: relative;
  z-index: 2;
  width: min(840px, calc(100% - 48px));
  margin-left: 180px;
  padding: 40px 0 110px;

  @media (max-width: 1024px) {
    width: min(700px, calc(100% - 48px));
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    margin: 0 16px;
    padding: 52px 0 110px;
  }
`;

export const LeftColumn = styled.div`
  width: min(600px, 100%);

  .button-group-vertical {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
  }

  .button-group-vertical .placeholder-alert {
    width: 100%;
    color: #8b1f1f;
    font-size: 14px;
    font-weight: 600;
  }

  .button-group-vertical > input {
    width: 100%;
    min-height: 38px;
    padding: 7px 14px;
    border: 2px solid ${(props) => props.theme.colors.indigo};
    border-radius: 20px;
    outline: none;
    font-family: inherit;
  }

  .button-group-vertical > button:not([type="submit"]) {
    padding: 5px 20px;
    border: 0;
    border-radius: 20px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
  }
`;

export const DadosTitle = styled.h1`
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
`;

export const DadosDescricao = styled.p`
  margin-top: 8px;
  color: white;
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 20px;
    br { display: none; }
  }
`;

export const PersonalData = styled.div`
  width: 100%;
  margin-top: 30px;
  padding: 22px 20px;
  border-radius: 30px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    border-radius: 24px;
  }
`;

export const InputWrapper = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 7px 18px;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 20px;
  background: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;

  &:focus-within { border-color: ${(props) => props.theme.colors.lightOrange}; }

  label {
    margin-right: 6px;
    color: white;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  input {
    min-width: 0;
    width: 100%;
    height: 100%;
    border: 0;
    outline: 0;
    color: white;
    background: transparent;
    font-family: inherit;
    font-size: 16px;
    font-weight: 400;
  }

  input::placeholder { color: ${(props) => props.theme.colors.muted}; }

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
    border-radius: 16px;
  }
`;

export const SaveButton = styled.button`
  width: 160px;
  margin-top: 2px;
  padding: 5px 20px;
  border: 0;
  border-radius: 20px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${(props) => props.theme.colors.challengeOrange}; }
`;

export const ExcluirButton = styled.button`
  max-width: 260px;
  padding: 5px 20px;
  border: 0;
  border-radius: 20px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #e74c3c; }
`;

export const LogoBottom = styled.img`
  position: fixed;
  z-index: 2;
  bottom: 31px;
  left: 52px;
  height: 48px;
  width: auto;

  @media (max-width: 768px) {
    left: 36px;
    bottom: 28px;
    height: 30px;
  }
`;

export const Image = styled.img`
  position: fixed;
  z-index: 1;
  width: 1200px;
  max-width: 60vw;
  right: -300px;
  bottom: -150px;
  pointer-events: none;
  @media (max-width: 1439px) { display: none; }
`;

export const LogoTop = styled.img``;

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
  width: min(440px, 100%);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 8px solid white;
  border-radius: 30px;
  color: white;
  background: ${(props) => props.theme.colors.indigo};
  box-shadow: 0 24px 70px rgba(15, 0, 55, 0.45);
  font-family: "Baloo Paaji 2", sans-serif;
  text-align: center;

  h2 { margin-top: 10px; font-size: 28px; line-height: 1.2; }
  p { max-width: 340px; margin-top: 8px; font-size: 16px; line-height: 1.35; }
  label { width: 100%; margin-top: 22px; text-align: left; font-size: 16px; font-weight: 600; }
  > input {
    width: 100%;
    min-height: 44px;
    margin-top: 6px;
    padding: 8px 16px;
    border: 2px solid transparent;
    border-radius: 22px;
    outline: none;
    color: ${(props) => props.theme.colors.primaryDark};
    background: white;
    font-family: inherit;
    font-size: 16px;
  }
  > input:focus { border-color: ${(props) => props.theme.colors.lightOrange}; }

  @media (max-width: 480px) {
    padding: 24px 18px;
    border-width: 6px;
    border-radius: 24px;
    h2 { font-size: 24px; }
  }
`;

export const ModalIcon = styled.div`
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 4px solid ${(props) => props.theme.colors.lightOrange};
  border-radius: 50%;
  color: ${(props) => props.theme.colors.lightOrange};
  font-size: 30px;
  font-weight: 800;
`;

export const ModalActions = styled.div`
  width: 100%;
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 480px) { flex-direction: column-reverse; }
`;

export const CancelButton = styled.button`
  padding: 8px 20px;
  border: 2px solid white;
  border-radius: 22px;
  color: white;
  background: transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.12); }
  &:disabled { cursor: wait; opacity: 0.65; }
`;

export const ConfirmDeleteButton = styled.button`
  padding: 8px 20px;
  border: 2px solid #e74c3c;
  border-radius: 22px;
  color: white;
  background: #e74c3c;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  &:hover { border-color: #c0392b; background: #c0392b; }
  &:disabled { cursor: wait; opacity: 0.65; }
`;

export const ModalError = styled.p`
  width: 100%;
  margin-top: 8px !important;
  color: #ffd1d1;
  text-align: left;
  font-weight: 600;
`;
