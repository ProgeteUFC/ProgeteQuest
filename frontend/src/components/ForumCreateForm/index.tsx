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
  onCreate: (title: string, message: string) => Promise<void>;
  disabled?: boolean;
}

const ForumCreateForm: React.FC<ForumCreateFormProps> = ({ onCreate, disabled }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    try {
      await onCreate(title, message);
      setTitle("");
      setMessage("");
    } catch {
      // Mantém os campos preenchidos para o usuário tentar novamente.
    }
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
      <SubmitButton type="submit" disabled={disabled}>{disabled ? "Salvando..." : "Criar tópico"}</SubmitButton>
    </FormContainer>
  );
};

export default ForumCreateForm;
