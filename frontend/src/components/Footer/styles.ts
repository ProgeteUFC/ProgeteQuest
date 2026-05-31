import styled from "styled-components";

const mobilePrototype = `@media ((max-width: 410px) and (max-height: 900px)), (min-width: 1024px) and (max-width: 1024px) and (max-height: 900px)`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  margin-top: auto;
  width: 100%;
  min-height: 60px;
  background: transparent;
  position: relative;
  z-index: 1;
`;
export const Image = styled.img`
  height: 48px;
  margin-left: 2rem;
  margin-bottom: 0.7rem;
  ${mobilePrototype} {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
    height: 30px;
  }
`;

export const Text = styled.p`
  color: ${(props) => props.theme.colors.white};
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 10px;
  margin-bottom: 5px;
`;
