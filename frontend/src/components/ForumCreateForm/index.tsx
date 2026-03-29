import React, { useState } from "react";
import {
  FormContainer,
  FieldGroup,
  Label,
  Input,
  TextArea,
  SubmitButton,
} from "./styles";


interface ForumCreateFormProps {
  onCreate: (title: string, message: string) => void;
}

const ForumCreateForm: React.FC<ForumCreateFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    onCreate(title, message);
    setTitle("");
    setMessage("");
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>Título:</Label>
        <Input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Digite o título do fórum"
          required
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Mensagem:</Label>
        <TextArea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui"
          required
        />
      </FieldGroup>
      <SubmitButton type="submit">Criar Fórum</SubmitButton>
    </FormContainer>
  );
};

export default ForumCreateForm;
