import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.kingfisherDaisy};
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }
`;

export const Login = styled.div`
  display: flex;
  margin-bottom: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  gap: 2rem;

  > img:first-child {
    width: 120px;
    height: auto;
  }
 
  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

export const LoginCard = styled.div`
  background: rgba(79, 65, 146, 0.8);
  border-radius: 28px;
  padding: 28px 20px 22px 20px;
  width: 430px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  gap: 14px;

  .user-type-row {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    justify-content: center;

    button {
      flex: 1;
      border: none;
      border-radius: 24px;
      background: transparent;
      color: #fff;
      font-weight: bold;
      font-size: 1.3rem;
      padding: 8px 0;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;

      &.active {
        background: #fff;
        color: #2c0383;
        cursor: default;
        box-shadow: 0 2px 8px rgba(44, 3, 131, 0.08);
      }

      &:not(.active):hover {
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        box-shadow: 0 2px 8px rgba(44, 3, 131, 0.18);
      }
    }
  }

  input {
    width: 100%;
    border: none;
    border-radius: 20px;
    padding: 10px 18px;
    font-size: 1rem;
    background: #fff;
    color: #2c0383;
    font-family: "Baloo Paaji 2", sans-serif;
    margin-bottom: 0;
    margin-top: 0;
    &::placeholder {
      color: #4f4192;
      opacity: 1;
    }
  }

  .forgot {
    color: #fff;
    font-size: 0.98rem;
    margin: 1px 0 1px 8px;
    text-decoration: none;
    font-family: "Baloo Paaji 2", sans-serif;
    &:hover {
      color: #f97316;
    }
  }

  .actions-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 1px;

    .login-btn,
    .register-btn {
      flex: 1;
      border: none;
      border-radius: 16px;
      padding: 3px 0;
      font-size: 1rem;
      font-weight: 700;
      font-family: "Baloo Paaji 2", sans-serif;
      background: #fff;
      color: #2c0383;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }

    .login-btn:hover,
    .register-btn:hover {
      background: #f97316;
      color: #fff;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  button {
    flex: 1;
    padding: 0.8rem 1rem;
    border-radius: 50px;
    border: 2px solid transparent;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.challengeOrange};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  input {
    padding: 0.9rem 1.2rem;
    border: none;
    border-radius: 30px;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.kingfisherDaisy};
    font-size: 1rem;
    font-family: "Baloo Paaji 2", sans-serif;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.kingfisherDaisy};
      opacity: 0.7;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.white};
    font-size: 0.85rem;
    text-decoration: none;
    align-self: flex-start;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.challengeOrange};
      text-decoration: underline;
    }
  }
`;

export const LoginButton = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  font-weight: bold;
  font-size: 1rem;
  font-family: "Baloo Paaji 2", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const RegisterLink = styled(Link)`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  font-weight: bold;
  font-size: 0.95rem;
  font-family: "Baloo Paaji 2", sans-serif;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const AboutUs = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  height: 100vh;
  background: none;

  .welcome-area {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    position: relative;
    padding-top: 60px;
    padding-left: 0;
    color: #fff;
    font-family: "Baloo Paaji 2", sans-serif;
  }

  .planet {
    position: absolute;
    top: 4px;
    right: 0;
    width: 350px;
    z-index: 2;
  }

  .bemvindo {
    font-size: 2.3rem;
    font-weight: bold;
    padding-left: 10px;
    margin-top: 60px;
    margin-bottom: 6px;
    color: #fff;
    font-family: "Baloo Paaji 2", sans-serif;
  }

  .logo-progetequest {
    display: block;
    width: 530px;
    max-width: 100%;
    margin: 0 200px 18px 0;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18));
  }

  .desafie {
    font-size: 2.1rem;
    font-weight: bold;
    padding-left: 10px;
    margin: 24px 0 6px 0;
    color: #fff;
    font-family: "Baloo Paaji 2", sans-serif;
  }

  .descricao {
    font-size: 1.1rem;
    font-family: "Baloo Paaji 2", sans-serif;
    font-weight: 600;
    padding-left: 10px;
    margin-bottom: 40px;
    margin-top: 10px;
    color: #fff;
    line-height: 1.4;
  }

  .copyright {
    position: fixed;
    bottom: 18px;
    right: 32px;
    left: auto;
    width: auto;
    text-align: right;
    font-size: 0.95rem;
    color: #d1cbe7;
    font-family: "Baloo Paaji 2", sans-serif;
    opacity: 0.8;
    z-index: 10;
  }

  @media (max-width: 900px) {
    .planet {
      width: 120px;
      top: 10px;
    }
    .logo-progetequest {
      width: 250px;
    }
    .bemvindo,
    .desafie {
      font-size: 1.3rem;
    }
    .descricao {
      font-size: 0.95rem;
    }
  }
`;

export const LogoTopLeft = styled.div`
  position: fixed;
  top: 32px;
  left: 40px;
  z-index: 10;

  img {
    width: 180px;
    height: auto;
  }
`;

export const Astronaut = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  padding-top: 82px;

  z-index: 5;
  width: 320px;
  height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  img {
    width: 500px;
    height: auto;
    margin-left: 30px;
    margin-bottom: -250;
    z-index: 2;
    pointer-events: none;
    user-select: none;
  }

  .smoke {
    width: 1200px;
    height: 1000px;
    margin-top: -440px;
    margin-left: 500px;
    opacity: 0.7;
    filter: blur(2px);
    z-index: 1;
    pointer-events: none;
    user-select: none;
  }

  @media (max-width: 900px) {
    width: 180px;
    height: 180px;
    img {
      width: 120px;
    }
    .smoke {
      width: 160px;
      height: 80px;
      margin-top: -20px;
    }
  }
`;

export const SmokeRight = styled.img`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 1000px;
  height: 900px;
  opacity: 0.7;
  filter: blur(2px);
  z-index: 1;
  pointer-events: none;
  user-select: none;
  margin-right: -380px;
  margin-bottom: -410px;

  @media (max-width: 900px) {
    width: 160px;
    height: 80px;
    margin-right: -20px;
    margin-bottom: -20px;
  }
`;
