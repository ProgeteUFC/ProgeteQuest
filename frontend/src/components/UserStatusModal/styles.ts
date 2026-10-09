import styled from "styled-components";
import { adminButton, adminInput, adminTypography } from "../../styles/admin";

export const Backdrop = styled.div`
  ${adminTypography}
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.kingfisherDaisy}aa;
  display: grid;
  place-items: center;
  padding: 20px;
`;

export const Dialog = styled.form`
  width: min(100%, 560px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  box-shadow: 0 12px 35px ${({ theme }) => theme.colors.kingfisherDaisy}40;
  text-align: left;
  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.heading.sm};
    font-weight: 800;
    line-height: 1.2;
  }
  p {
    margin: 0;
    overflow-wrap: anywhere;
  }
  label {
    font-weight: 700;
  }
  textarea {
    ${adminInput} min-height: 110px;
    resize: vertical;
  }
  small {
    font-size: ${({ theme }) => theme.typography.text.small};
  }
  .user-status-info {
    padding: 16px;
    border-radius: 18px;
    background: ${({ theme }) => theme.colors.primaryLight};
    border-left: 4px solid ${({ theme }) => theme.colors.challengeOrange};
  }
  .user-status-confirm {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .user-status-confirm input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.indigo};
    &:focus-visible {
      outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
      outline-offset: 3px;
    }
  }
  .user-status-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    flex-wrap: wrap;
  }
  button {
    ${adminButton}
  }
  button[type="button"] {
    background: transparent;
    border-color: ${({ theme }) => theme.colors.indigo};
    color: ${({ theme }) => theme.colors.indigo};
  }
  button.danger {
    border-color: ${({ theme }) => theme.colors.challengeOrange};
  }
  [role="alert"] {
    padding: 12px 16px;
    border-radius: 14px;
    border: 2px solid ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorBackground};
    font-weight: 700;
  }
  @media (max-width: 600px) {
    padding: 20px 16px;
    border-radius: 24px;
    .user-status-actions {
      flex-direction: column-reverse;
    }
    button {
      width: 100%;
    }
  }
`;
