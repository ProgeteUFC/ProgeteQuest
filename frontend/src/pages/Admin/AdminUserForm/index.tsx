import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  adminErrorMessage,
  adminService,
  type ManagedUser,
  type ManagedUserUpdate,
} from "../../../services/adminService";
import {
  AdminUserEditBackdrop,
  AdminUserEditDialog,
  AdminUsersPanel,
} from "./styles";

interface AdminUserFormProps {
  userId?: string;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function AdminUserForm({
  userId,
  onClose,
  onSaved,
}: AdminUserFormProps = {}) {
  const params = useParams();
  const id = userId ?? params.id;
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError("");
    setUser(null);
    adminService
      .buscarUsuario(id)
      .then((data) => {
        if (!active) return;
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setRegistration(
          data.registrationStudent ?? data.registrationTeacher ?? "",
        );
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
  }, [id, revision]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!user || saving) return;
    setSaving(true);
    setError("");
    setSuccess("");
    const body: ManagedUserUpdate = { name: name.trim(), email: email.trim() };
    if (user.type === "student") body.registrationStudent = registration.trim();
    if (user.type === "teacher") body.registrationTeacher = registration.trim();
    try {
      await adminService.editarUsuario(user.userId, body);
      setSuccess("Dados do usuário atualizados com sucesso.");
      if (onSaved) onSaved();
      else setRevision((r) => r + 1);
    } catch (err) {
      setError(adminErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const content = (
    <>
      {!onClose && <Link to="/admin/users">Voltar para usuários</Link>}
      <h1>Editar usuário</h1>
      {success && <p role="status" data-feedback="success">{success}</p>}
      {error && <p role="alert">{error}</p>}
      {loading && <p role="status">Carregando usuário...</p>}
      {!loading && !user && (
        <button onClick={() => setRevision((r) => r + 1)}>
          Tentar novamente
        </button>
      )}
      {!loading && user && (
        <>
          <p>
            Perfil:{" "}
            {
              {
                student: "Aluno",
                teacher: "Professor",
                admin: "Administrador",
              }[user.type]
            }
            . O perfil não pode ser alterado.
          </p>
          <p>Status: {user.status === "active" ? "Ativo" : "Inativo"}</p>
          <form className="admin-user-edit" onSubmit={save}>
            <fieldset disabled={saving}>
              <label>
                Nome
                <input
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                E-mail
                <input
                  required
                  type="email"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              {user.type !== "admin" && (
                <label>
                  {user.type === "student" ? "Matrícula" : "SIAPE"}
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    title="Informe exatamente 6 dígitos"
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                  />
                </label>
              )}
              <button type="submit">
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </fieldset>
          </form>
        </>
      )}
    </>
  );

  if (onClose) {
    return (
      <AdminUserEditBackdrop
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) onClose();
        }}
      >
        <AdminUserEditDialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-user-edit-title"
          onKeyDown={(event) => {
            if (event.key === "Escape" && !saving) onClose();
          }}
        >
          <button type="button" disabled={saving} onClick={onClose} aria-label="Fechar edição">
            Fechar
          </button>
          <div id="admin-user-edit-title">{content}</div>
        </AdminUserEditDialog>
      </AdminUserEditBackdrop>
    );
  }

  return <AdminUsersPanel>{content}</AdminUsersPanel>;
}
