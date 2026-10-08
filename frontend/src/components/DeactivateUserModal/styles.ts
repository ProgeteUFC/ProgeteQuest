import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background: rgba(20, 3, 65, 0.78);
  backdrop-filter: blur(5px);
`;

export const Card = styled.div`
  width: min(560px, 100%);
  max-height: 100%;
  overflow-y: auto;
  padding: 28px 30px;
  border: 8px solid white;
  border-radius: 30px;
  color: white;
  background: ${({ theme }) => theme.colors.indigo};
  box-shadow: 0 24px 70px rgba(15, 0, 55, 0.45);
  font-family: "Baloo Paaji 2", sans-serif;

  @media (max-width: 480px) {
    padding: 22px 16px;
    border-width: 6px;
    border-radius: 24px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 14px;

  h2 {
    font-size: 26px;
    line-height: 1.15;
  }
`;

export const IconCircle = styled.div`
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 4px solid ${({ theme }) => theme.colors.lightOrange};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.lightOrange};
`;

export const Subtitle = styled.p`
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.35;

  strong {
    color: ${({ theme }) => theme.colors.lightOrange};
  }
`;

export const InfoBox = styled.div`
  margin-top: 16px;
  padding: 14px 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 15px;
  line-height: 1.35;

  h3 {
    font-size: 16px;
    margin-bottom: 6px;
  }

  ul {
    padding-left: 20px;
    display: grid;
    gap: 3px;
  }
`;

export const NotDeletionBox = styled(InfoBox)`
  border-color: ${({ theme }) => theme.colors.lightOrange};
  background: rgba(255, 165, 0, 0.12);
`;

export const Field = styled.div`
  margin-top: 18px;

  label {
    display: block;
    font-size: 16px;
    font-weight: 600;
  }

  textarea {
    width: 100%;
    min-height: 88px;
    margin-top: 6px;
    padding: 10px 14px;
    resize: vertical;
    border: 2px solid transparent;
    border-radius: 16px;
    outline: none;
    color: ${({ theme }) => theme.colors.primaryDark};
    background: white;
    font-family: inherit;
    font-size: 16px;
  }

  textarea:focus {
    border-color: ${({ theme }) => theme.colors.lightOrange};
  }
`;

export const FieldHint = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  opacity: 0.9;
`;

export const ConfirmRow = styled.label`
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.3;
  cursor: pointer;

  input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.lightOrange};
    cursor: pointer;
  }
`;

export const ErrorMessage = styled.p`
  margin-top: 14px;
  color: #ffd1d1;
  font-weight: 600;
`;

export const Actions = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  padding: 8px 20px;
  border: 2px solid white;
  border-radius: 22px;
  color: white;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export const DeactivateButton = styled.button`
  padding: 8px 20px;
  border: 2px solid ${({ theme }) => theme.colors.lightOrange};
  border-radius: 22px;
  color: ${({ theme }) => theme.colors.primaryDark};
  background: ${({ theme }) => theme.colors.lightOrange};
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #ffb733;
    border-color: #ffb733;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
