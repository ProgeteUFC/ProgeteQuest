import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserStatusModal from "../../../components/UserStatusModal";
import {
  adminErrorMessage,
  adminService,
  type ManagedUser,
} from "../../../services/adminService";
import { AdminUsersPanel } from "../AdminUserForm/styles";

export default function AdminUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    adminService
      .listarUsuarios()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err) => {
        if (active) setError(adminErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);

  const filtered = users.filter((user) =>
    [
      user.name,
      user.email,
      user.registrationStudent,
      user.registrationTeacher,
    ].some((value) =>
      value?.toLowerCase().includes(search.trim().toLowerCase()),
    ),
  );

  return (
    <AdminUsersPanel>
      <h1>Usuários</h1>
      <Link to="/admin/users/new">Cadastrar novo usuário</Link>
      {success && <p role="status" data-feedback="success">{success}</p>}
      <label>
        Pesquisar por nome, e-mail ou matrícula/SIAPE
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
        />
      </label>
      {loading && <p role="status">Carregando usuários...</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setRevision((r) => r + 1)}>
            Tentar novamente
          </button>
        </div>
      )}
      {!loading && !error && (
        <div className="admin-users-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Matrícula/SIAPE</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {
                      {
                        student: "Aluno",
                        teacher: "Professor",
                        admin: "Administrador",
                      }[user.type]
                    }
                  </td>
                  <td>
                    {user.registrationStudent ??
                      user.registrationTeacher ??
                      "—"}
                  </td>
                  <td>{user.status === "active" ? "Ativo" : "Inativo"}</td>
                  <td>
                    <div className="admin-users-actions">
                      <Link to={`/admin/users/${user.userId}`}>Editar</Link>
                      <button
                        onClick={() => {
                          setSuccess("");
                          setSelected(user);
                        }}
                      >
                        {user.status === "active" ? "Desativar" : "Reativar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p>Nenhum usuário encontrado.</p>}
        </div>
      )}
      {selected && (
        <UserStatusModal
          user={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSuccess(
              selected.status === "active"
                ? "Usuário desativado com sucesso."
                : "Usuário reativado com sucesso.",
            );
            setSelected(null);
            setRevision((r) => r + 1);
          }}
        />
      )}
    </AdminUsersPanel>
  );
}
