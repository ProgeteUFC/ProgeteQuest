import styled from "styled-components";
import { AdminUsersPanel } from "../AdminUserForm/styles";
import { Dialog } from "../../../components/UserStatusModal/styles";
import { adminButton } from "../../../styles/admin";

export const AuditPanel = styled(AdminUsersPanel)`
  box-sizing: border-box;

  .audit-heading h1 {
    margin: 0;
  }
  .audit-heading p {
    margin: 8px 0 0;
  }

  > .audit-mock-notice {
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 18px;
    border-left: 5px solid ${({ theme }) => theme.colors.challengeOrange};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    font-weight: 700;
  }

  th {
    color: ${({ theme }) => theme.colors.indigo};
    white-space: nowrap;
    font-size: 14px;
  }
  td {
    font-size: 15px;
    vertical-align: top;
  }
  .audit-date {
    white-space: nowrap;
  }
  .audit-action-badge {
    display: inline-flex;
    padding: 4px 12px;
    border-radius: 20px;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.indigo};
    font-size: 14px;
    font-weight: 700;
  }
  .audit-action-badge[data-action="USER_PERMANENTLY_DELETED"],
  .audit-action-badge[data-action="USER_DEACTIVATED"] {
    background: ${({ theme }) => theme.colors.errorBackground};
    color: ${({ theme }) => theme.colors.error};
  }
  .audit-action-badge[data-action="USER_CREATED"],
  .audit-action-badge[data-action="USER_REACTIVATED"] {
    background: ${({ theme }) => theme.colors.successBackground};
    color: ${({ theme }) => theme.colors.success};
  }
  .audit-user strong {
    display: block;
  }
  .audit-user small {
    display: block;
    font-size: 13px;
    opacity: 0.8;
    overflow-wrap: anywhere;
  }
  .audit-details-button {
    ${adminButton}
    min-height: 36px;
    padding: 6px 16px;
    white-space: nowrap;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .audit-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex-wrap: wrap;
    padding: 16px 12px;
    font-size: 14px;
  }
  .audit-pagination span {
    margin-right: auto;
  }
  .audit-pagination button {
    ${adminButton}
    min-height: 36px;
    padding: 6px 16px;
  }

  @media (max-width: 768px) {
    padding: 28px 16px;
    .admin-users-table {
      padding: 8px 12px;
    }
  }
`;

export const AuditDialog = styled(Dialog)`
  width: min(100%, 720px);

  &:focus {
    outline: none;
  }

  h3 {
    margin: 8px 0 0;
    font-size: ${({ theme }) => theme.typography.text.lead};
    font-weight: 800;
  }

  .audit-changes {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
  }
  .audit-changes th,
  .audit-changes td {
    padding: 10px 8px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: top;
    overflow-wrap: anywhere;
  }
  .audit-changes th {
    color: ${({ theme }) => theme.colors.indigo};
    font-weight: 800;
  }
  .audit-changes tbody tr:last-child th,
  .audit-changes tbody tr:last-child td {
    border-bottom: 0;
  }
  .audit-changes tbody tr:hover {
    background: transparent;
  }

  .audit-note {
    padding: 12px 16px;
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.primaryLight};
    border-left: 4px solid ${({ theme }) => theme.colors.challengeOrange};
  }

  @media (max-width: 600px) {
    .audit-changes th,
    .audit-changes td {
      padding: 8px 4px;
      font-size: 14px;
    }
  }
`;
