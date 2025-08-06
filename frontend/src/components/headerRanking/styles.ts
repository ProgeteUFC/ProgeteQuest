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

export const Image = styled.img`
    display: flex;
    width: 203px;
    height: 83px;
    align-items: center;
`

export const Icon = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    svg {
        color: ${props => props.theme.COLORS.white};
        cursor: pointer;
    }
`;