import React from "react";
import { DataContainer } from "./styles";
import { StyledInput } from "../../pages/MeusDados/styles";
import { Title } from "../Button/styles";

interface DataProfileProps {
  title: string;
  value?: string;
  type?: string;
  onValueChange?: (value: string) => void;
}

export function DataProfile({
  title,
  value = "",
  type = "text",
  onValueChange,
  ...rest
}: DataProfileProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) onValueChange(e.target.value);
  };

  return (
    <DataContainer {...rest} style={{ cursor: "default" }}>
      <Title>{title}</Title>
      <StyledInput
        type={type}
        value={value}
        onChange={handleChange}
        {...rest}
      />
    </DataContainer>
  );
}
