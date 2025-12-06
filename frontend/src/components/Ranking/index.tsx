import { Position } from "../Position"
import { Container, Content } from "../Ranking/styles"
import { RiArrowRightWideLine } from "react-icons/ri"
import { Icon } from "./styles"

export function Ranking() {
    return (
        <>
            <Container>
                <Content>
                    <Position atividade="Turma 1" number={'1º'} suffix="Lugar"/>
                    <Position atividade="Turma 2" number={'2º'} suffix="Lugar"/>
                    <Position atividade="Turma 3" number={'4º'} suffix="Lugar"/>
                    <Position atividade="Turma 4" number={'9º'} suffix="Lugar"/>
                    <Icon>
                        <RiArrowRightWideLine size={100} />
                    </Icon>
                </Content>
            </Container>
        </>
    )
}