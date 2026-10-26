import styled from "styled-components";
import { adminButton, adminInput, adminTypography } from "../../../styles/admin";

export const Panel = styled.section`
  ${adminTypography}
  width: min(960px, 100%);
  margin: 0 auto;
  padding: 32px;
  h1 { margin: 20px 0 10px; font-size: 34px; line-height: 1.2; }
  h2 { font-size: 24px; line-height: 1.3; margin: 16px 0 8px; }
  h3 { margin-top: 16px; }
  p { margin: 10px 0; }
  a { color: inherit; text-underline-offset: 3px; }
  button { ${adminButton} }
  form, .notice {
    margin-top: 24px; padding: 24px; border-radius: 24px;
    background: white; color: ${({ theme }) => theme.colors.primaryDark};
  }
  fieldset { min-width: 0; border: 0; display: flex; flex-direction: column; gap: 16px; }
  legend { font-size: 22px; font-weight: 800; }
  .class-options { max-height: 320px; overflow-y: auto; display: grid; gap: 10px; padding: 4px; }
  .check { display: flex; align-items: flex-start; gap: 12px; overflow-wrap: anywhere; }
  input[type="checkbox"] { flex-shrink: 0; width: 20px; height: 20px; margin-top: 3px; accent-color: ${({ theme }) => theme.colors.indigo}; }
  .destination { display: grid; gap: 8px; }
  select { ${adminInput} }
  ul { padding-left: 24px; }
  dl { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; margin-top: 12px; }
  dd { margin: 0; font-weight: 800; }
  .success { border-left: 5px solid ${({ theme }) => theme.colors.success}; }
  .error { border-left: 5px solid ${({ theme }) => theme.colors.error}; }
  @media (max-width: 600px) { padding: 24px 16px; form, .notice { padding: 20px 16px; } }
`;
