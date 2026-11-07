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

export const DeletionNotice = styled.div`
  margin-top: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 4px solid ${(props) => props.theme.colors.challengeOrange};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.primaryDark};
  background: ${(props) => props.theme.colors.primaryLight};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 15px;
  line-height: 1.35;
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
