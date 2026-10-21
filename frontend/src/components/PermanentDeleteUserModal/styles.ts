import styled from "styled-components";
import { adminInput } from "../../styles/admin";
import { Dialog } from "../UserStatusModal/styles";

export const DeleteDialog = styled(Dialog)`
  border-top: 8px solid ${({ theme }) => theme.colors.error};

  &:focus {
    outline: none;
  }

  input[type="text"],
  input[type="password"] {
    ${adminInput}
  }

  .delete-warning {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px;
    border-radius: 18px;
    border: 2px solid ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorBackground};
    color: ${({ theme }) => theme.colors.error};
    font-weight: 700;
  }

  .delete-warning svg {
    flex-shrink: 0;
    margin-top: 3px;
  }

  .delete-section-title {
    font-size: ${({ theme }) => theme.typography.text.lead};
    font-weight: 800;
  }

  .delete-checks {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .delete-checks li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-weight: 700;
  }

  .delete-checks svg {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .delete-checks [data-ok="true"] {
    color: ${({ theme }) => theme.colors.success};
  }

  .delete-checks [data-ok="false"] {
    color: ${({ theme }) => theme.colors.error};
  }

  .delete-note {
    padding: 14px 16px;
    border-radius: 18px;
    background: ${({ theme }) => theme.colors.primaryLight};
    border-left: 4px solid ${({ theme }) => theme.colors.challengeOrange};
  }

  .delete-field {
    display: grid;
    gap: 6px;
  }

  .delete-phrase {
    padding: 2px 8px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.primaryLight};
    font-weight: 800;
    letter-spacing: 0.02em;
    user-select: all;
  }

  .delete-pending {
    margin: 0;
    padding-left: 20px;
    font-size: ${({ theme }) => theme.typography.text.small};
  }

  [role="status"].delete-success {
    padding: 14px 16px;
    border-radius: 14px;
    border: 2px solid ${({ theme }) => theme.colors.success};
    background: ${({ theme }) => theme.colors.successBackground};
    color: ${({ theme }) => theme.colors.success};
    font-weight: 700;
  }

  button.danger {
    background: ${({ theme }) => theme.colors.error};
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.white};
  }

  button.danger:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.kingfisherDaisy};
    color: ${({ theme }) => theme.colors.white};
  }

  button.danger:disabled {
    cursor: not-allowed;
  }
`;
