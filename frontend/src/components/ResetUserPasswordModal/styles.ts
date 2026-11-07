import styled from "styled-components";
import { adminInput } from "../../styles/admin";

export const PasswordResetDialog = styled.dialog`
  width: min(560px, calc(100% - 40px));
  max-width: none;
  max-height: none;
  margin: auto;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;

  &::backdrop {
    background: ${({ theme }) => theme.colors.kingfisherDaisy}aa;
  }

  .reset-password-field {
    display: grid;
    gap: 6px;
  }

  input[type="password"] {
    ${adminInput}
  }
`;
