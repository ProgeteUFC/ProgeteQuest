import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Painel do administrador</h1>
      <ul>
        <li>
          <Link to="/admin/users">Gerenciar usuários</Link>
        </li>
      </ul>
    </div>
  );
}
