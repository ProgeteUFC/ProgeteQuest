import styled from 'styled-components';

export const ButtonContainer = styled.button`
    display: flex;
    width: 373px;
    height: 36px;
    color:white;
    border-radius: 20px;
    background-color: ${props => props.theme.COLORS.indigo};
    border: 0;
    color: ${props => props.theme.COLORS.white};
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`

export const Title = styled.p`
    font-size: ${props => props.theme.FONT_SIZE.P14}px;
`