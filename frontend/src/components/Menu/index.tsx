import { Button } from "../Button";
import { Container } from "./styles";
import { Link } from "react-router-dom";


export function Menu(){
    return (
        <Container> 
            <Button title={'Cadastrar Disciplinas'} />
            <Button title={'Disciplinas'} />
            <Link
            to={"/ranking"}><Button title={'Meus Dados'} /></Link>
            <Button title={'Suporte'} />
        </Container>
    )
}