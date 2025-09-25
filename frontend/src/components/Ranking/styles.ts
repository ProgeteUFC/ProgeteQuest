import styled from "styled-components";

export const Container = styled.div`
    background-color: ${props => props.theme.COLORS.indigo};
    display: flex;
    width: 580px;
    height: 100px;
    justify-content: space-between;
    padding: 20px;
    border-radius: 20px;
    margin-top: 20px;
    align-items: center;
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