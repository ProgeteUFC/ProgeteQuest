import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 250px;
  padding-top: 50px;
  overflow: hidden;
  min-height: 100vh;
  font-family: "Baloo Paaji 2", sans-serif;
  position: relative;
  background-color: ${({ theme }) => theme.colors.kingfisherDaisy};

  .planet-image {
    width: 1300px;
    height: auto;
    position: fixed;
    bottom: 10px;
    right: 120px;
    transform: translate(40%, 40%);
    // z-index: 10;
  }

  @media (max-width: 1160px) {
    margin-top: 180px;
    margin-left: 30px;

    .planet-image {
      width: 800px;
      transform: translate(30%, 30%);
    }
  }

  @media (max-width: 650px) {
    margin-top: 170px;
    margin-left: 20px;

    .planet-image {
      width: 500px;
      transform: translate(20%, 30%);
    }
  }

  @media (max-width: 450px) {
    margin-top: 160px;
    margin-left: 15px;

    .planet-image {
      width: 300px;
      transform: translate(15%, 30%);
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  max-width: 90vw;
  height: 370px;
  max-height: 80vh;
  padding: 23px 20px;
  border-radius: 40px;
  font-size: 16px;
  background-color: #ffffff;
  // margin: 40px 0 0 0;
  margin-top: 15px;
  // z-index: 11;
  font-family: "Booal Paaji 2", sans-serif;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  align-self: flex-start;

  @media (max-width: 650px) {
    width: 60vw;
    margin-left: 0;
    padding: 10px 15px;
  }

  @media (max-width: 450px) {
    width: 70vw;
    padding: 8px 12px;
  }

  @media (max-width: 450px) {
    width: 70vw;
    padding: 12px;
  }
`;

export const LogoContainer = styled.div`
  position: fixed;
  bottom: 15px;
  left: 25px;
  z-index: 12;

  .logo {
    width: 200px;
    height: auto;
    display: block;
  }

  @media (max-width: 1160px) {
    left: 30px;
    bottom: 70px;
    .logo {
      width: 110px;
    }
  }

  @media (max-width: 650px) {
    left: 20px;
    bottom: 60px;
    .logo {
      width: 100px;
    }
  }

  @media (max-width: 450px) {
    left: 15px;
    bottom: 50px;
    .logo {
      width: 80px;
    }
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #2c0383;
  font-size: 16px;
  font-family: "Baloo Paaji 2", sans-serif;
  outline: none;
  transition: background 0.2s, border 0.2s;

  &::placeholder {
    color: #fff;
    opacity: 0.7;
  }

  &:focus {
    background: #fff;
    color: #2c0383;
    border: 1.5px solid #2c0383;
  }
`;

export const SaveButton = styled.button`
  width: 160px;
  padding: 8px 0;
  margin: 10px 0 0 440px;
  display: block;
  background: #fff;
  color: ${({ theme }) => theme.colors.kingfisherDaisy};
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-family: "Baloo Paaji 2", sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  z-index: 2;

  &:hover {
    background: ${({ theme }) => theme.colors.challengeOrange};
    color: #fff;
  }
`;
