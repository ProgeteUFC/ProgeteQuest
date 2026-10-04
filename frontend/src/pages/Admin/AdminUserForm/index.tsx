import { useParams } from "react-router-dom";

export default function AdminUserForm() {
  const { id } = useParams();
  const isNew = id === undefined;

  return (
    <div style={{ padding: 32 }}>
      <h1>{isNew ? "Novo usuário" : `Editar usuário ${id}`}</h1>
      <p>Formulário em construção.</p>
    </div>
  );
}
