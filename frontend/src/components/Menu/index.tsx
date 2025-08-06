import { Button } from "../Button";
import { Container } from "./styles";


export function Menu(){
    return (
        <Container> 
            <Button title={'Cadastrar Disciplinas'} />
            <Button title={'Disciplinas'} />
            <Button title={'Meus Dados'} />
            <Button title={'Suporte'} />
        </Container>
    )
}