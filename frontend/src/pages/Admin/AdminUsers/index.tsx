import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiMoreVertical, FiUserPlus, FiX } from "react-icons/fi";
import AdminUserForm from "../AdminUserForm";
import UserDeletionImpact from "../../../components/UserDeletionImpact";
import UserStatusModal from "../../../components/UserStatusModal";
import PermanentDeleteUserModal from "../../../components/PermanentDeleteUserModal";
import { Backdrop, Dialog } from "../../../components/UserStatusModal/styles";
import {
  adminErrorMessage,
  adminService,
  type ManagedUser,
} from "../../../services/adminService";
import { UsersPanel } from "./styles";
import FilterSelect from "./FilterSelect";

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
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState("");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [infoMode, setInfoMode] = useState<InfoMode>(null);
  const [infoUser, setInfoUser] = useState<ManagedUser | null>(null);
  const [userDetails, setUserDetails] = useState<ManagedUser | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const infoRequest = useRef(0);
  const infoDialog = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    adminService
      .listarUsuarios({
        search: search.trim() || undefined,
        type: profileFilter === "all" ? undefined : profileFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: PAGE_SIZE,
      })
      .then(({ data, meta }) => {
        if (!active) return;
        if (page > Math.max(1, meta.totalPages)) {
          setPage(Math.max(1, meta.totalPages));
          return;
        }
        setUsers(data);
        setTotalItems(meta.totalItems);
        setTotalPages(meta.totalPages);
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
  }, [revision, search, profileFilter, statusFilter, page]);

  useEffect(() => {
    if (!infoMode) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    infoDialog.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") closeInfo();
      if (event.key !== "Tab") return;
      const buttons = infoDialog.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      if (!buttons?.length) { event.preventDefault(); return; }
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === infoDialog.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [infoMode]);

  const pageCount = Math.max(1, totalPages);
  const currentPage = Math.min(page, pageCount);
  const visibleUsers = users;

  async function openInfo(user: ManagedUser, mode: Exclude<InfoMode, null>) {
    const requestId = ++infoRequest.current;
    setMenuUserId(null);
    setInfoUser(user);
    setInfoMode(mode);
    setModalLoading(mode === "view");
    setModalError("");
    setUserDetails(null);
    try {
      if (mode === "view") {
        const details = await adminService.buscarUsuario(user.userId);
        if (requestId === infoRequest.current) setUserDetails(details);
      }
    } catch (err) {
      if (requestId === infoRequest.current) setModalError(adminErrorMessage(err));
    } finally {
      if (requestId === infoRequest.current) setModalLoading(false);
    }
  }

  function closeInfo() {
    ++infoRequest.current;
    setInfoMode(null);
    setInfoUser(null);
    setUserDetails(null);
    setModalError("");
  }

  return (
    <UsersPanel>
      <header className="users-heading">
        <div><h1>Usuários</h1><p>Gerencie os perfis e acessos da comunidade Progete.</p></div>
        <Link to="/admin/users/new"><FiUserPlus aria-hidden="true" /> Cadastrar usuário</Link>
      </header>
      {success && <p role="status" data-feedback="success">{success}</p>}
      <div className="admin-users-controls">
        <label>
          Buscar
          <span className="users-search-field">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            type="search"
            placeholder="Nome, e-mail ou matrícula/SIAPE"
          />
          {search && <button type="button" aria-label="Limpar busca" onClick={() => { setSearch(""); setPage(1); }}><FiX aria-hidden="true" /></button>}
          </span>
        </label>
        <FilterSelect label="Perfil" value={profileFilter}
          onChange={(value) => { setProfileFilter(value as ProfileFilter); setPage(1); }}
          options={[{ value: "all", label: "Todos" }, { value: "student", label: "Aluno" }, { value: "teacher", label: "Professor" }, { value: "admin", label: "Administrador" }]} />
        <FilterSelect label="Status" value={statusFilter}
          onChange={(value) => { setStatusFilter(value as StatusFilter); setPage(1); }}
          options={[{ value: "all", label: "Todos" }, { value: "active", label: "Ativo" }, { value: "inactive", label: "Inativo" }]} />
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
                  <td><span className="profile-badge">{profileLabel(user.type)}</span></td>
                  <td>
                    {user.registrationStudent ??
                      user.registrationTeacher ??
                      "—"}
                  </td>
                  <td><span className="status-badge" data-status={user.status}>{user.status === "active" ? "Ativo" : "Inativo"}</span></td>
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
                            Visualizar detalhes
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
                          {user.type === "teacher" && <Link role="menuitem" to={`/admin/teachers/${user.userId}/classes`}>Transferir turmas</Link>}
                          <button
                            role="menuitem"
                            disabled={user.userId === currentUserId}
                            title={user.userId === currentUserId ? "Não é possível excluir a própria conta" : undefined}
                            onClick={() => {
                              setMenuUserId(null);
                              setSuccess("");
                              setDeleteTarget(user);
                            }}
                          >
                            Excluir definitivamente
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalItems === 0 && <p>Nenhum usuário encontrado.</p>}
          {totalItems > 0 && (
            <nav className="admin-users-pagination" aria-label="Paginação de usuários">
              <span>
                {totalItems} usuários · Página {currentPage} de {pageCount}
              </span>
              <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                Anterior
              </button>
              <button type="button" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
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
      {deleteTarget && (
        <PermanentDeleteUserModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => {
            setSuccess("Usuário excluído definitivamente com sucesso.");
            setDeleteTarget(null);
            setRevision((r) => r + 1);
          }}
        />
      )}
      {editUserId && (
        <AdminUserForm
          userId={editUserId}
          onClose={() => setEditUserId(null)}
          onSaved={() => {
            setSuccess("Dados do usuário atualizados com sucesso.");
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
            ref={infoDialog}
            tabIndex={-1}
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
{infoMode === "impact" && (
  <UserDeletionImpact key={infoUser.userId} user={infoUser} />
)}
            <div className="user-status-actions">
              <button type="button" onClick={closeInfo}>Fechar</button>
            </div>
          </Dialog>
        </Backdrop>
      )}
    </UsersPanel>
  );
}
