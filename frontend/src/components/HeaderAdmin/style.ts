import styled from "styled-components";

const mobilePrototype = `@media (max-width: 1100px)`;

export const MenuContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 86px;
  box-sizing: border-box;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
  padding: 0 20px;
  gap: 20px;

  ${mobilePrototype} {
    justify-content: space-between;
    padding: 0 12px;
    min-height: 60px;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  img {
    max-width: 180px;
    height: auto;
  }

  ${mobilePrototype} {
    flex: 1;
    justify-content: center;

    img {
      max-width: 150px;
    }
  }
`;

export const MenuContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 15px;
  min-width: 0;

  ${mobilePrototype} {
    display: none;
  }
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 10px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  color: white;
  align-items: center;
  justify-content: center;
  border-radius: 50px;

  padding: 5px 14px;
  min-width: 90px;

  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  &:active {
    scale: 0.97;
    transition-duration: 100ms;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const RightBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  z-index: 20;
`;

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  z-index: 20;

  ${mobilePrototype} {
    display: flex;
  }
`;

interface MobileMenuProps {
  open: boolean;
}

export const MobileMenu = styled.div<MobileMenuProps>`
  display: none;

  ${mobilePrototype} {
    display: ${({ open }) => (open ? "flex" : "none")};
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(30, 20, 80, 0.98);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  & > div {
    background: #fff;
    border-radius: 32px;
    padding: 28px 0;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80vw;
    max-width: 340px;
    min-width: 220px;
    gap: 12px;
  }

  & a {
    width: 90%;
    min-width: 160px;
    max-width: 300px;
    margin: 0 auto;
    border-radius: 24px !important;
    font-size: 1rem;
    font-weight: bold;
    padding: 10px 0;
    background: ${(props) => props.theme.colors.indigo};
    color: #fff;
    text-align: center;
    transition: background 0.2s;
  }

  & a:active,
  & a:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;