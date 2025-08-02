import {Atividade, Container, Number} from "./styles";

interface PositionProps {
    atividade:string;
    number:string | number;
}
export function Position({ atividade, number, ...rest }: PositionProps) {
    return (
        <>
            <Container {...rest}>
                <Atividade>{atividade}</Atividade>
                <Number>{number}</Number>
            </Container>
        </>
    )
}