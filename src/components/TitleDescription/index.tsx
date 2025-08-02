import React from "react";
import { Container, Title } from "./styles";

interface TitleDescriptionProps {
    titleDescription: string;
}

export function TitleDescription ( { titleDescription }: TitleDescriptionProps ) {
    return(
        <Container>
            <Title>
                {titleDescription}
            </Title>
        </Container>
    )
}          