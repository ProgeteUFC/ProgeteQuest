import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.kingfisherDaisy};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Planeta = styled.img`
  position: absolute;
  top: 10px;
  right: -8px;
  width: 130px;
  transform: scale(1.45);
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
  background: rgba(79, 65, 146, 0.8);
  border-radius: 28px;
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
  border-radius: 20px;
  border: none;
  background-color: ${(props) => props.theme.colors.white};
  padding: 0 18px;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.kingfisherDaisy};
  margin-bottom: 10px;
  font-family: "Baloo Paaji 2", sans-serif;
  outline: none;

  &::placeholder {
    color: #2c0383;
    opacity: 1;
    font-weight: 500;
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

export const EsqueciSenha = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 0.98rem;
  font-family: "Baloo Paaji 2", sans-serif;
  text-decoration: none;
  cursor: pointer;
  padding: 2px 0 14px;
  text-align: left;
  display: block;

  &:hover {
    color: ${(props) => props.theme.colors.challengeOrange};
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
  color: ${(props) => props.theme.colors.kingfisherDaisy};
  border: none;
  border-radius: 16px;
  padding: 1px 38px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Baloo Paaji 2", sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
    color: ${(props) => props.theme.colors.white};
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const BtnCriarConta = styled.button`
  background-color: #00c4cc;
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 16px;
  padding: 1px 18px;
  font-size: 1rem;
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
  font-size: 0.875rem;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  max-width: 358px;
  margin-bottom: 12px;
  padding: 0 2px;
`;

export const AstronautaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 160px;
  margin: 4px 0 10px;
  left: 50%;
  transform: translateX(-50%);
`;

export const Smoke = styled.img`
  width: 300px;
  transform: scale(1.65);
  opacity: 0.7;
  filter: blur(1px);
  pointer-events: none;
  flex-shrink: 0;

  &.smoke-left {
    margin-right: -50px;
  }

  &.smoke-right {
    margin-left: -50px;
  }
`;

export const Astronauta = styled.img`
  width: 150px;
  transform: scale(1.75);
  display: block;
  pointer-events: none;
  position: relative;
  z-index: 1;
`;
export const Footer = styled.footer`
  width: 100%;
  max-width: 402px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  margin-top: auto;
  padding-bottom: 10px;
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