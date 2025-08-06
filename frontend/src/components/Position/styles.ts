import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`
    
export const Number = styled.div`
    color: ${props => props.theme.COLORS.white};
    font-size: ${props => props.theme.FONT_SIZE.G45}px;
    font-weight: bold;
`;

export const Atividade = styled.div`
    color: ${props => props.theme.COLORS.white};
    font-size: ${props => props.theme.FONT_SIZE.P14}px;
`;