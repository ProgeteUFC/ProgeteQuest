import { css } from "styled-components";

export const adminTypography = css`
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: ${({ theme }) => theme.typography.text.base};
  line-height: 1.5;
`;

export const adminButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 22px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.indigo};
  color: ${({ theme }) => theme.colors.white};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.ui.button};
  font-weight: 800;
  line-height: 1.3;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.challengeOrange};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const adminInput = css`
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 10px 16px;
  border: 2px solid transparent;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.indigo};
  color: ${({ theme }) => theme.colors.white};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.ui.input};
  font-weight: 400;
  &::placeholder {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.challengeOrange};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.6;
  }
`;
