import { Link } from "react-router-dom";

export default function AdminUsers() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Usuários</h1>
      <Link to="/admin/users/new">Novo usuário</Link>
      <p>Lista de usuários em construção.</p>
    </div>
  );
}
