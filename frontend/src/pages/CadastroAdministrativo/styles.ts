import styled from "styled-components";
import { CadastrarButton } from "../RegisterPage/styles";

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