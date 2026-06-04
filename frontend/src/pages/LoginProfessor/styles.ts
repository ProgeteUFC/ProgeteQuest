import styled from "styled-components";

export const Container = styled.div`
  background: linear-gradient(175deg, #3b1fa3 0%, #2a0d8f 45%, #180b5e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

export const Planeta = styled.img`
  position: absolute;
  top: 10px;
  right: -14px;
  width: 95px;
  pointer-events: none;
  z-index: 1;
`;

export const Header = styled.header`
  width: 100%;
  max-width: 402px;
  text-align: center;
  padding-top: 44px;
  margin-bottom: 22px;
  position: relative;
  z-index: 2;
`;

export const BemVindo = styled.p`
  color: ${(props) => props.theme.colors.white};
  font-size: 19px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
  margin-bottom: 4px;
`;

export const Logo = styled.img`
  width: 220px;
  margin: 0 auto 6px;
  display: block;
`;

export const Tagline = styled.p`
  color: ${(props) => props.theme.colors.white};
  font-size: 15px;
  font-weight: 600;
  font-family: "Baloo Paaji 2", sans-serif;
`;

export const Card = styled.section`
  width: 100%;
  max-width: 358px;
  background-color: #3d2db5;
  border-radius: 14px;
  padding: 20px 18px 18px;
  margin-bottom: 18px;
`;

export const CardTitle = styled.h2`
  color: ${(props) => props.theme.colors.white};
  font-size: 13px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
  letter-spacing: 1.6px;
  text-align: center;
  margin-bottom: 16px;
`;

export const InputField = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 25px;
  border: none;
  background-color: ${(props) => props.theme.colors.white};
  padding: 0 16px;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-family: "Baloo Paaji 2", sans-serif;
  outline: none;

  &::placeholder {
    color: #555;
  }

  &:focus {
    box-shadow: 0 0 0 2px #f7c948;
  }
`;

export const EsqueciSenha = styled.button`
  background: none;
  border: none;
  color: #c8bfff;
  font-size: 12.5px;
  font-family: "Baloo Paaji 2", sans-serif;
  text-decoration: underline;
  cursor: pointer;
  padding: 2px 0 14px;
  text-align: left;
  display: block;

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const BtnLogin = styled.button`
  background-color: ${(props) => props.theme.colors.white};
  color: #1a0a3c;
  border: none;
  border-radius: 25px;
  padding: 10px 28px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0ecff;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const BtnCriarConta = styled.button`
  background-color: #00c4cc;
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 25px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00adb5;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const Descricao = styled.p`
  color: ${(props) => props.theme.colors.white};
  font-size: 12.5px;
  font-family: "Baloo Paaji 2", sans-serif;
  line-height: 1.65;
  text-align: center;
  max-width: 358px;
  margin-bottom: 12px;
  padding: 0 2px;
`;

export const Astronauta = styled.img`
  width: 120px;
  display: block;
  margin: 4px auto 10px;
  pointer-events: none;
`;

export const Footer = styled.footer`
  width: 100%;
  max-width: 402px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 10px;
  margin-top: auto;
  padding-bottom: 16px;
`;

export const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const FooterLogo = styled.img`
  height: 28px;
`;

export const FooterNome = styled.span`
  color: ${(props) => props.theme.colors.white};
  font-size: 12px;
  font-weight: 700;
  font-family: "Baloo Paaji 2", sans-serif;
`;

export const FooterCopy = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 8.5px;
  font-family: "Baloo Paaji 2", sans-serif;
  text-align: right;
  max-width: 160px;
  line-height: 1.4;
`;
