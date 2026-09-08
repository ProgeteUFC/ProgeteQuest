import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-columns: minmax(390px, 0.85fr) minmax(560px, 1.15fr);
  align-items: center;
  gap: clamp(28px, 5vw, 90px);
  padding: 100px clamp(32px, 6vw, 110px) 70px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.kingfisherDaisy};
  font-family: "Baloo Paaji 2", sans-serif;

  @media (max-width: 1100px) {
    display: flex;
    min-height: 100dvh;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    padding: 100px 24px 36px;
    overflow-y: auto;
  }

  @media (max-width: 600px) {
    justify-content: flex-start;
    gap: 18px;
    padding: 28px 16px 24px;
  }
`;

export const Login = styled.section`
  position: relative;
  z-index: 4;
  display: flex;
  width: 100%;
  justify-content: center;

  @media (max-width: 1100px) {
    order: 2;
    max-width: 460px;
  }
`;

export const LoginCard = styled.div`
  width: min(430px, 100%);
  padding: 28px 20px 22px;
  border-radius: 28px;
  background: rgba(79, 65, 146, 0.92);
  box-shadow: 0 12px 35px rgba(22, 4, 68, 0.25);

  form {
    display: flex;
    flex-direction: column;
  }

  input {
    width: 100%;
    min-height: 46px;
    margin-bottom: 15px;
    padding: 10px 18px;
    border: 2px solid transparent;
    border-radius: 23px;
    outline: none;
    background: white;
    color: ${({ theme }) => theme.colors.primaryDark};
    font: inherit;
    font-size: 16px;

    &::placeholder {
      color: ${({ theme }) => theme.colors.indigo};
      opacity: 1;
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.challengeOrange};
    }
  }

  .forgot {
    align-self: flex-start;
    margin: 0 0 12px 8px;
    color: white;
    font: inherit;
    font-size: 15px;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.colors.challengeOrange};
      outline: none;
    }
  }

  .actions-row {
    display: flex;
    gap: 10px;

    button {
      min-height: 38px;
      flex: 1;
      padding: 5px 12px;
      border: 0;
      border-radius: 19px;
      background: white;
      color: ${({ theme }) => theme.colors.primaryDark};
      font: inherit;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;

      &:hover,
      &:focus-visible {
        background: ${({ theme }) => theme.colors.challengeOrange};
        color: white;
        outline: none;
      }

      &:disabled {
        cursor: wait;
        opacity: 0.65;
      }
    }
  }

  @media (max-width: 420px) {
    padding: 22px 16px 18px;
    border-radius: 24px;

    .actions-row {
      flex-direction: column;
    }
  }
`;

export const Feedback = styled.p`
  margin: 10px 7px 0;
  color: #ffd1d1;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
`;

export const AboutUs = styled.section`
  position: relative;
  z-index: 3;
  display: flex;
  width: 100%;
  justify-content: center;
  color: white;

  .welcome-area {
    position: relative;
    width: min(600px, 100%);
    padding-top: 55px;
  }

  .planet {
    position: absolute;
    z-index: -1;
    top: -45px;
    right: -20px;
    width: min(350px, 58%);
    pointer-events: none;
  }

  .bemvindo,
  .desafie,
  .descricao,
  .copyright {
    margin: 0;
  }

  .bemvindo {
    padding-left: 10px;
    font-size: clamp(28px, 2.3vw, 37px);
    font-weight: 800;
  }

  .logo-progetequest {
    display: block;
    width: min(530px, 90%);
    margin: 2px 0 18px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18));
  }

  .desafie {
    padding-left: 10px;
    font-size: clamp(25px, 2vw, 34px);
    font-weight: 800;
  }

  .descricao {
    max-width: 580px;
    margin-top: 10px;
    padding-left: 10px;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
  }

  .copyright {
    position: fixed;
    right: 32px;
    bottom: 18px;
    color: #d1cbe7;
    font-size: 14px;
    opacity: 0.8;
  }

  @media (max-width: 1100px) {
    order: 1;
    max-width: 600px;
    text-align: center;

    .welcome-area {
      padding-top: 0;
    }

    .planet {
      top: -75px;
      right: 0;
      width: 180px;
    }

    .logo-progetequest {
      width: min(360px, 80%);
      margin: 0 auto 6px;
    }

    .bemvindo,
    .desafie,
    .descricao {
      padding-left: 0;
    }

    .bemvindo {
      font-size: 25px;
    }

    .desafie {
      font-size: 22px;
    }

    .descricao {
      margin: 8px auto 0;
      font-size: 15px;
    }

    .copyright {
      position: static;
      margin-top: 16px;
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .bemvindo {
      font-size: 20px;
    }

    .logo-progetequest {
      width: min(280px, 78%);
    }

    .desafie {
      font-size: 18px;
    }

    .descricao,
    .planet {
      display: none;
    }

    .copyright {
      margin-top: 8px;
      font-size: 11px;
    }
  }
`;

export const LogoTopLeft = styled.div`
  position: fixed;
  z-index: 10;
  top: 32px;
  left: 40px;

  img {
    width: 180px;
    height: auto;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

export const Astronaut = styled.div`
  position: fixed;
  z-index: 2;
  bottom: -15px;
  left: 30px;
  width: 330px;
  pointer-events: none;

  > img:first-child {
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .smoke {
    position: absolute;
    z-index: 1;
    bottom: -50px;
    left: 50px;
    width: 500px;
    opacity: 0.65;
    filter: blur(2px);
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;
