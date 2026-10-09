import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import AdminUserForm from "../AdminUserForm";
import UserStatusModal from "../../../components/UserStatusModal";
import { Backdrop, Dialog } from "../../../components/UserStatusModal/styles";
import {
  adminErrorMessage,
  adminService,
  type ManagedUser,
  type UserDeletionImpact,
} from "../../../services/adminService";
import { AdminUsersPanel } from "../AdminUserForm/styles";

const PAGE_SIZE = 10;
type ProfileFilter = "all" | ManagedUser["type"];
type StatusFilter = "all" | ManagedUser["status"];
type InfoMode = "view" | "impact" | null;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR");
}

function profileLabel(type: ManagedUser["type"]) {
  return {
    student: "Aluno",
    teacher: "Professor",
    admin: "Administrador",
  }[type];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [infoMode, setInfoMode] = useState<InfoMode>(null);
  const [infoUser, setInfoUser] = useState<ManagedUser | null>(null);
  const [userDetails, setUserDetails] = useState<ManagedUser | null>(null);
  const [impact, setImpact] = useState<UserDeletionImpact | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const currentUserId = localStorage.getItem("userId");

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

  const filtered = users
    .filter((user) =>
      [
        user.name,
        user.email,
        user.registrationStudent,
        user.registrationTeacher,
      ].some((value) =>
        value?.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    )
    .filter((user) => profileFilter === "all" || user.type === profileFilter)
    .filter((user) => statusFilter === "all" || user.status === statusFilter)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function openInfo(user: ManagedUser, mode: Exclude<InfoMode, null>) {
    setMenuUserId(null);
    setInfoUser(user);
    setInfoMode(mode);
    setModalLoading(true);
    setModalError("");
    setUserDetails(null);
    setImpact(null);
    try {
      if (mode === "view") {
        setUserDetails(await adminService.buscarUsuario(user.userId));
      } else {
        setImpact(await adminService.consultarImpacto(user.userId));
      }
    } catch (err) {
      setModalError(adminErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  }

  function closeInfo() {
    setInfoMode(null);
    setInfoUser(null);
    setUserDetails(null);
    setImpact(null);
    setModalError("");
  }

  return (
    <AdminUsersPanel>
      <h1>Usuários</h1>
      <Link to="/admin/users/new">Cadastrar novo usuário</Link>
      {success && <p role="status" data-feedback="success">{success}</p>}
      <div className="admin-users-controls">
        <label>
          Buscar
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            type="search"
            placeholder="Nome, e-mail ou matrícula/SIAPE"
          />
        </label>
        <label>
          Perfil
          <select
            value={profileFilter}
            onChange={(event) => {
              setProfileFilter(event.target.value as ProfileFilter);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="student">Aluno</option>
            <option value="teacher">Professor</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              setPage(1);
            }}
          >
            <option value="all">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </label>
      </div>
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
                <th>Data de cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{profileLabel(user.type)}</td>
                  <td>
                    {user.registrationStudent ??
                      user.registrationTeacher ??
                      "—"}
                  </td>
                  <td>{user.status === "active" ? "Ativo" : "Inativo"}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="admin-user-menu">
                      <button
                        type="button"
                        aria-label={`Ações para ${user.name}`}
                        aria-haspopup="menu"
                        aria-expanded={menuUserId === user.userId}
                        onClick={() =>
                          setMenuUserId((current) =>
                            current === user.userId ? null : user.userId,
                          )
                        }
                      >
                        <FiMoreVertical aria-hidden="true" />
                      </button>
                      {menuUserId === user.userId && (
                        <div className="admin-user-menu-options" role="menu">
                          <button role="menuitem" onClick={() => void openInfo(user, "view")}>
                            Visualizar
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              setMenuUserId(null);
                              setEditUserId(user.userId);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            role="menuitem"
                            disabled={user.status === "active" && user.userId === currentUserId}
                            title={user.userId === currentUserId ? "Não é possível desativar a própria conta" : undefined}
                            onClick={() => {
                              setMenuUserId(null);
                              setSuccess("");
                              setSelected(user);
                            }}
                          >
                            {user.status === "active" ? "Desativar" : "Reativar"}
                          </button>
                          <button role="menuitem" onClick={() => void openInfo(user, "impact")}>
                            Consultar impacto da exclusão
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p>Nenhum usuário encontrado.</p>}
          {filtered.length > 0 && (
            <nav className="admin-users-pagination" aria-label="Paginação de usuários">
              <span>
                {filtered.length} usuários · Página {page} de {pageCount}
              </span>
              <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                Anterior
              </button>
              <button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>
                Próxima
              </button>
            </nav>
          )}
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
      {editUserId && (
        <AdminUserForm
          userId={editUserId}
          onClose={() => setEditUserId(null)}
          onSaved={() => {
            setEditUserId(null);
            setRevision((value) => value + 1);
          }}
        />
      )}
      {infoMode && infoUser && (
        <Backdrop
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeInfo();
          }}
        >
          <Dialog
            as="div"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-info-title"
          >
            <h2 id="admin-user-info-title">
              {infoMode === "view" ? "Dados do usuário" : "Impacto potencial da exclusão"}
            </h2>
            <p>{infoUser.name} — {infoUser.email}</p>
            {modalLoading && <p role="status">Carregando...</p>}
            {modalError && <p role="alert">{modalError}</p>}
            {infoMode === "view" && userDetails && (
              <dl className="admin-user-details">
                <dt>Perfil</dt><dd>{profileLabel(userDetails.type)}</dd>
                <dt>Status</dt><dd>{userDetails.status === "active" ? "Ativo" : "Inativo"}</dd>
                {userDetails.type === "student" && <><dt>Matrícula</dt><dd>{userDetails.registrationStudent || "—"}</dd></>}
                {userDetails.type === "teacher" && <><dt>SIAPE</dt><dd>{userDetails.registrationTeacher || "—"}</dd></>}
                <dt>Cadastro</dt><dd>{formatDate(userDetails.createdAt)}</dd>
                <dt>Última atualização</dt><dd>{formatDate(userDetails.updatedAt)}</dd>
                <dt>Desativado em</dt><dd>{formatDate(userDetails.deactivatedAt)}</dd>
                <dt>Desativado por (ID)</dt><dd>{userDetails.deactivatedBy || "—"}</dd>
                <dt>Motivo</dt><dd>{userDetails.deactivationReason || "—"}</dd>
              </dl>
            )}
            {infoMode === "impact" && impact && (
              <>
                <p>Resumo de vínculos existentes. Nenhum dado será excluído.</p>
                <dl className="deletion-impact-list">
                  <dt>Turmas como aluno</dt><dd>{impact.classesAsStudent}</dd>
                  <dt>Turmas como professor</dt><dd>{impact.classesAsTeacher}</dd>
                  <dt>Atividades das turmas</dt><dd>{impact.activities}</dd>
                  <dt>Avaliações das turmas</dt><dd>{impact.assessments}</dd>
                  <dt>Check-ins / participações</dt><dd>{impact.checkins}</dd>
                  <dt>Tópicos no fórum</dt><dd>{impact.forumTopics}</dd>
                  <dt>Publicações no fórum</dt><dd>{impact.forumPosts}</dd>
                </dl>
              </>
            )}
            <div className="user-status-actions">
              <button type="button" onClick={closeInfo}>Fechar</button>
            </div>
          </Dialog>
        </Backdrop>
      )}
    </AdminUsersPanel>
  );
}
