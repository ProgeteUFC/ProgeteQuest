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