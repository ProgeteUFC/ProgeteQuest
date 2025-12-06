import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 100%;
    height: 115px;
    background-color: ${props => props.theme.COLORS.indigo};
    align-items: center;
    padding: 20px;
    justify-content: space-between;  
`

export const Box = styled.div`
gap:15px;
display:flex;
`

export const Image = styled.img`
    display: flex;
    width: 203px;
    height: 83px;
    align-items: center;
`

export const IconHome = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    svg {
        color: ${props => props.theme.COLORS.white};
        cursor: pointer;
    }&:hover{
        svg{
        color: ${props => props.theme.COLORS.lightOrange};
        }
    }
`;

export const IconExite = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    svg {
        color: ${props => props.theme.COLORS.white};
        cursor: pointer;
    }
    span {
        font-family: 'Codec Pro', sans-serif;
        font-size: 12px;
    }&:hover{
        svg{
        color: ${props => props.theme.COLORS.lightOrange};
        }
        span {
            color: ${props => props.theme.COLORS.lightOrange};
        }
    }
`;