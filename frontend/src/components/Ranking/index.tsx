import { Position } from "../Position"
import { Container } from "../Ranking/styles"
import { RiArrowRightWideLine } from "react-icons/ri"
import { Icon } from "./styles"

export function Ranking(){
    return (
        <>
        <Container>
            <Position atividade="Disciplina 1" number={'1º'} />
            <Position atividade="Disciplina 2" number={'2º'} />
            <Position atividade="Disciplina 3" number={'4º'} />
            <Position atividade="Disciplina 4" number={'9º'} />
            <Icon>
                <RiArrowRightWideLine size={60} />
            </Icon>
        </Container>
        </>
    )
}