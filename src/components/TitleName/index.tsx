import { Container, Title } from "./styles";

interface TitleNameProps {
    titleName: string;
}

export function TitleName ( { titleName }: TitleNameProps ) {
    return(
        <Container>
            <Title>
                {titleName}
            </Title>
        </Container>
    )
}          