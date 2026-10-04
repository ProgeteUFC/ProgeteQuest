import styled from "styled-components";
import { CadastrarButton, Container as RegisterContainer } from "../RegisterPage/styles";

// O cabeçalho e o rodapé já pertencem ao layout administrativo.
export const Container = styled(RegisterContainer)`
  min-height: 0;
  align-items: flex-start;
  padding: 88px 32px 40px;
  overflow: visible;

  @media (max-width: 1439px) {
    padding: 88px 24px 40px;
    overflow: visible;
  }

  @media (max-width: 600px) {
    padding: 76px 16px 28px;
  }

  @media (max-height: 720px) and (min-width: 1440px) {
    padding-top: 88px;
    overflow: visible;
  }
`;

/* Botão secundário de "gerar senha", reaproveitando o CadastrarButton (mesmo tamanho/formato)*/
export const GerarSenhaButton = styled(CadastrarButton)`
  width: 100%;
  margin-bottom: 4px;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.indigo};
  color: ${({ theme }) => theme.colors.indigo};

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.indigo};
    color: white;
  }
`;

/* Caixa exibida após o cadastro, com a senha temporária gerada. */
export const PasswordResultBox = styled.div`
  overflow-wrap: anywhere;
  margin-top: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #eef7ee;
  border: 1px solid #b7e0b7;
  color: #18753a;
  font-size: 14px;
  line-height: 1.4;

  code {
    padding: 2px 6px;
    border-radius: 6px;
    background: #d9ecd9;
    font-weight: 700;
  }

  small {
    display: block;
    margin-top: 6px;
    color: #2f6b2f;
    font-weight: 600;
  }
`;
export const UserTypeRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const UserTypeButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: 10px 12px;
  border: 2px solid ${({ theme }) => theme.colors.indigo};
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  background: ${({ $active, theme }) => $active ? theme.colors.indigo : 'white'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.indigo};
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.challengeOrange}; }
`;
