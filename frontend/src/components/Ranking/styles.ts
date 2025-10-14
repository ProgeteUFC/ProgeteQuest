import styled from "styled-components";

export const Container = styled.div`
    background-color: ${props => props.theme.COLORS.indigo};
    display: flex;
    justify-content: center;
    algn-items: center;
    border-radius: 50px;
    align-items: center;
    padding: 10px;
`;

export const Content = styled.div`
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: center;
`;

export const Position = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0px;
    margin: 0;
    padding: 0;
    position: relative;
`;

export const Icon = styled.div`
    cursor: pointer;
    svg {
        color: ${props => props.theme.COLORS.white}; /* 1. Cor padrão: white */
        transition: color 0.3s ease-in-out;
    }
    &:hover {
        svg {
            color: ${props => props.theme.COLORS.lightOrange}; /* Cor ao passar o mouse: lightOrange */
        }
    }
`;