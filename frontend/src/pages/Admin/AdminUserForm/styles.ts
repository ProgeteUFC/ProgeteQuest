import styled from "styled-components";
import {
  adminButton,
  adminInput,
  adminTypography,
} from "../../../styles/admin";

export const AdminUsersPanel = styled.section`
  ${adminTypography}
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 40px 32px;
  color: ${({ theme }) => theme.colors.white};

  h1 {
    margin: 20px 0;
    font-size: ${({ theme }) => theme.typography.heading.md};
    font-weight: 800;
    line-height: 1.2;
  }
  p {
    margin: 12px 0;
  }
  > a {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 700;
    text-underline-offset: 4px;
  }
  > a[href="/admin/users/new"] {
    ${adminButton}
  }
  > label,
  .admin-user-edit label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 20px 0;
    font-weight: 800;
  }
  > label {
    max-width: 560px;
  }
  > label input,
  .admin-user-edit input {
    ${adminInput}
  }
  > button,
  .admin-user-edit button,
  .admin-users-actions button,
  > [role="alert"] button {
    ${adminButton}
  }
  > [role="alert"],
  > [role="status"] {
    padding: 14px 18px;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 18px;
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    border-left: 5px solid ${({ theme }) => theme.colors.challengeOrange};
    overflow-wrap: anywhere;
  }
  > [role="status"] {
    border-left-color: ${({ theme }) => theme.colors.indigo};
  }
  > [data-feedback="success"] {
    color: ${({ theme }) => theme.colors.success};
    background: ${({ theme }) => theme.colors.successBackground};
    border-left-color: ${({ theme }) => theme.colors.success};
  }
  > [role="alert"] {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorBackground};
    border-left-color: ${({ theme }) => theme.colors.error};
  }
  .admin-user-edit {
    max-width: 600px;
    margin: 24px 0;
    padding: 24px;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    border-radius: 28px;
    box-shadow: 0 12px 35px ${({ theme }) => theme.colors.kingfisherDaisy}40;
  }
  .admin-user-edit fieldset {
    border: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .admin-user-edit label {
    margin: 0;
  }
  .admin-user-edit small {
    font-size: ${({ theme }) => theme.typography.text.small};
  }
  .admin-users-table {
    overflow-x: auto;
    margin-top: 24px;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    border-radius: 24px;
    padding: 8px 16px;
    box-shadow: 0 12px 35px ${({ theme }) => theme.colors.kingfisherDaisy}40;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  td,
  th {
    padding: 16px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  th {
    font-weight: 800;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
  tbody tr:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
  .admin-users-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .admin-users-actions a {
    color: ${({ theme }) => theme.colors.indigo};
    font-weight: 800;
    text-underline-offset: 4px;
  }
  a:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
    outline-offset: 4px;
    border-radius: 4px;
  }
  .admin-users-table > p {
    padding: 16px;
  }

  @media (max-width: 600px) {
    padding: 28px 16px;
    h1 {
      font-size: ${({ theme }) => theme.typography.heading.sm};
    }
    .admin-user-edit {
      padding: 18px 14px;
      border-radius: 24px;
    }
    > a[href="/admin/users/new"],
    > button {
      width: 100%;
    }
    .admin-users-table {
      padding: 4px 8px;
    }
  }
`;
