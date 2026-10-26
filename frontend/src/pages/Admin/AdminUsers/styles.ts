import styled from "styled-components";
import { AdminUsersPanel } from "../AdminUserForm/styles";
import { adminButton, adminInput } from "../../../styles/admin";

export const UsersPanel = styled(AdminUsersPanel)`
  box-sizing: border-box;

  .users-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;
  }
  .users-heading h1 { margin: 0; }
  .users-heading p { margin: 8px 0 0; }
  .users-heading a { ${adminButton} flex-shrink: 0; }

  .admin-users-controls {
    padding: 24px;
    border-radius: 24px;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .admin-users-controls input,
  .admin-users-controls select { box-sizing: border-box; }
  .users-filter {
    position: relative;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-weight: 800;
  }
  .users-filter-trigger {
    ${adminInput}
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-right: 20px;
    text-align: left;
    cursor: pointer;
  }
  .users-filter-trigger svg { width: 20px; height: 20px; flex-shrink: 0; }
  .users-filter-trigger[aria-expanded="true"] svg { transform: rotate(180deg); }
  .users-filter-options {
    position: absolute;
    z-index: 20;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    padding: 6px;
    border-radius: 18px;
    background: ${({ theme }) => theme.colors.indigo};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 8px 24px ${({ theme }) => theme.colors.kingfisherDaisy}30;
    font-weight: 400;
  }
  .users-filter-options [role="option"] {
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
  }
  .users-filter-options [aria-selected="true"] { font-weight: 800; }
  .users-filter-options [data-highlighted="true"] {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
  }
  .users-search-field { position: relative; display: block; }
  .users-search-field input { padding-right: 56px; }
  .users-search-field input::-webkit-search-cancel-button,
  .users-search-field input::-webkit-search-decoration { -webkit-appearance: none; }
  .users-search-field button {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: ${({ theme }) => theme.colors.white};
    font-size: 20px;
    cursor: pointer;
  }
  .admin-users-controls select:open {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 15 6-6 6 6'/%3E%3C/svg%3E");
  }
  .users-search-field button:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.challengeOrange};
  }
  .admin-users-controls select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 52px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 20px center;
    background-size: 20px;
    cursor: pointer;
  }
  .admin-users-table {
    padding: 8px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  th {
    color: ${({ theme }) => theme.colors.indigo};
    white-space: nowrap;
    font-size: 14px;
  }
  td { font-size: 15px; }
  td:first-child { font-weight: 700; min-width: 150px; }
  .profile-badge,
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .profile-badge {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.indigo};
  }
  .status-badge {
    background: ${({ theme }) => theme.colors.errorBackground};
    color: ${({ theme }) => theme.colors.error};
  }
  .status-badge[data-status="active"] {
    background: ${({ theme }) => theme.colors.successBackground};
    color: ${({ theme }) => theme.colors.success};
  }
  .admin-user-menu > button {
    border: 0;
    border-radius: 50%;
    color: ${({ theme }) => theme.colors.indigo};
    background: ${({ theme }) => theme.colors.primaryLight};
    font-size: 22px;
    cursor: pointer;
  }
  .admin-user-menu > button:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
  }
  .admin-user-menu-options {
    border-radius: 16px;
    width: max-content;
    min-width: 280px;
  }
  .admin-user-menu-options button,
  .admin-user-menu-options a {
    font: inherit;
    white-space: nowrap;
  }
  .admin-user-menu-options button:disabled { opacity: 0.5; cursor: not-allowed; }
  /* Keep the last rows' menus inside the scrolling table. */
  tbody tr:nth-last-child(-n + 3) .admin-user-menu-options {
    top: auto;
    bottom: calc(100% + 4px);
  }
  .admin-users-pagination { font-size: 14px; }

  @media (max-width: 768px) {
    .users-heading { align-items: flex-start; flex-direction: column; gap: 16px; }
    .users-heading a { width: 100%; box-sizing: border-box; }
    .admin-users-controls { padding: 18px; grid-template-columns: 1fr; }
    .admin-users-table { padding: 8px 12px; }
  }
`;
