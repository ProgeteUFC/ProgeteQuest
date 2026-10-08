import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeactivateUserModal from "../../../components/DeactivateUserModal";

export default function AdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const isNew = id === undefined;

  return (
    <div style={{ padding: 32 }}>
      <h1>{isNew ? "Novo usuário" : `Editar usuário ${id}`}</h1>
      <p>Formulário em construção.</p>

      {!isNew && (
        <>
          <button type="button" onClick={() => setDeactivateOpen(true)}>
            Desativar usuário
          </button>
          <DeactivateUserModal
            open={deactivateOpen}
            userId={id}
            onClose={() => setDeactivateOpen(false)}
            onDeactivated={() => navigate("/admin/users")}
          />
        </>
      )}
    </div>
  );
}
