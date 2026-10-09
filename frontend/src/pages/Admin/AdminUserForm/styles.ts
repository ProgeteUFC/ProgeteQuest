import styled from "styled-components";
import {
  adminButton,
  adminInput,
  adminTypography,
} from "../../../styles/admin";

export const AdminUserEditBackdrop = styled.div`
  ${adminTypography}
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.kingfisherDaisy}aa;
`;

export const AdminUserEditDialog = styled.div`
  width: min(620px, 100%);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 28px;
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 12px 35px ${({ theme }) => theme.colors.kingfisherDaisy}40;

  h1 {
    margin: 0 0 16px;
    font-size: ${({ theme }) => theme.typography.heading.sm};
  }
  > button {
    ${adminButton}
    float: right;
  }
  > p { margin: 10px 0; }
  .admin-user-edit {
    margin: 20px 0 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
  .admin-user-edit input { ${adminInput} }
  .admin-user-edit button { ${adminButton} }

  @media (max-width: 600px) {
    padding: 22px 16px;
    border-radius: 16px;
  }
`;

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
  .admin-users-controls {
    display: grid;
    grid-template-columns: minmax(220px, 2fr) repeat(2, minmax(150px, 1fr));
    gap: 14px;
    align-items: end;
    margin: 20px 0;
  }
  .admin-users-controls label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-weight: 800;
  }
  .admin-users-controls input,
  .admin-users-controls select {
    ${adminInput}
    width: 100%;
  }
  .admin-user-menu {
    position: relative;
    display: inline-block;
  }
  .admin-user-menu > button {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    padding: 0;
  }
  .admin-user-menu-options {
    position: absolute;
    z-index: 5;
    top: calc(100% + 4px);
    right: 0;
    min-width: 220px;
    display: grid;
    padding: 6px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 24px ${({ theme }) => theme.colors.kingfisherDaisy}30;
  }
  .admin-user-menu-options button {
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    background: transparent;
    text-align: left;
    cursor: pointer;
  }
  .admin-user-menu-options button:hover,
  .admin-user-menu-options button:focus-visible {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
  .admin-users-pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 14px 8px;
  }
  .admin-users-pagination button { ${adminButton} }
  .admin-users-pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
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
    .admin-users-controls {
      grid-template-columns: 1fr;
    }
    .admin-users-pagination {
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
`;
