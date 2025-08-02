import { ButtonContainer, Title, } from './styles';


interface ButtonDisciplinasProps {
    title: string;
}

export function ButtonDisciplinas({ title, ...rest }: ButtonDisciplinasProps){
    return (
        <ButtonContainer {...rest}>  
            <Title>
                {title}
            </Title>  
        </ButtonContainer>
    )
}
