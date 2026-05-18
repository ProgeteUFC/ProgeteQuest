import styled from "styled-components";

const mobilePrototype = `@media ((max-width: 410px) and (max-height: 900px)), (min-width: 1024px) and (max-width: 1024px) and (max-height: 900px)`;

export const MenuContainer = styled.div`
  display: flex;
  color: white;
  background-color: ${(props) => props.theme.colors.indigo};
  align-items: center;
  justify-content: flex-start;
  font-family: "Baloo Paaji 2", sans-serif;
  user-select: none;
  padding: 0 8px; 
  gap: 12px; 
`;

export const MenuOptions = styled.div`
  display: flex;
  background-color: white;
  padding: 8px 12px; 
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  gap: 20px; 
`;

export const Button = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.indigo};
  font-family: "Baloo Paaji 2", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 22px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    transition: background 0.2s, color 0.2s;
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const MenuContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-left: 245px; 
  ${mobilePrototype} {
    display: none;
  }
`;

export const MenuOption = styled.a`
  display: flex;
  background-color: ${(props) => props.theme.colors.indigo};
  color: white;
  align-items: center;
  border-radius: 50px;
  padding: 1px 0px;
  width: 200px;
  justify-content: center;
  gap: 30px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;

  &:active {
    scale: 0.97;
    transition-duration: 100ms;
  }
  
  &:hover {
    background-color: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;

export const Logo = styled.div`
  padding: 10px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${mobilePrototype} {
    padding: 0;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
}
`;


export const Box = styled.div`
  gap: 15px;
  display: flex;
`;

export const IconHome = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  svg {
    color: ${(props) => props.theme.colors.white};
    cursor: pointer;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;

export const IconExite = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
  gap: 5px;
  span {
    font-family: "Codec Pro", sans-serif;
    font-size: 13px;
    font-weight: 600;
  }
  &:hover {
    svg {
      color: ${(props) => props.theme.colors.lightOrange};
    }
    span {
      color: ${(props) => props.theme.colors.lightOrange};
    }
  }
`;

export const RightBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 8px;
  z-index: 20;
  ${mobilePrototype} {
   padding-left: 0;
}

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
  margin-right: 8px;
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
    top: 0;
    left: 0;
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
    padding: 32px 0 32px 0;
    box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80vw;
    max-width: 340px;
    min-width: 220px;
    gap: 18px;
  }
  & a {
    width: 90%;
    min-width: 160px;
    max-width: 300px;
    margin: 0 auto;
    border-radius: 24px !important;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 14px 0;
    background: ${(props) => props.theme.colors.indigo};
    color: #fff;
    text-align: center;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
    transition: background 0.2s;
  }
  & a:active, & a:hover {
    background: ${(props) => props.theme.colors.challengeOrange};
    color: #fff;
  }
`;