import styled from 'styled-components';

export const Container = styled.div`
    display: flex;    
    background-color: ${props => props.theme.COLORS.kingfisherDaisy};
    padding: 20px;
    font-size: 14px;
    margin-top: 30px;
    bottom: 0px;
    position: relative;
    width: 100%;
    height: 130px;
`
export const Image = styled.img`
    width: 220px;
    height: 56px;
    margin-top:20px;

`

export const Text = styled.p`
    position: absolute;
    right: 0;
    bottom:0;
    margin-right:10px;
    margin-bottom:5px;
    
`