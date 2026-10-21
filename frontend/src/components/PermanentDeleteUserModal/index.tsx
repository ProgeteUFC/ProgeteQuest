import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  adminErrorMessage,
  adminService,
  PERMANENT_DELETE_ENABLED,
  type ManagedUser,
  type UserDeletionImpact,
} from "../../services/adminService";
import { Backdrop } from "../UserStatusModal/styles";
import { DeleteDialog } from "./styles";

const CONFIRMATION_PHRASE = "EXCLUIR DEFINITIVAMENTE";
const MAX_REASON_LENGTH = 500;

const PROFILE_LABEL: Record<ManagedUser["type"], string> = {
  student: "Aluno",
  teacher: "Professor",
  admin: "Administrador",
};

const IMPACT_LABELS: [keyof UserDeletionImpact, string][] = [
  ["classesAsStudent", "Turmas como aluno"],
  ["classesAsTeacher", "Turmas como professor"],
  ["enrollments", "Matrículas associadas"],
  ["activities", "Atividades das turmas"],
  ["assessments", "Avaliações das turmas"],
  ["checkins", "Check-ins / participações"],
  ["codes", "Códigos de atividades"],
  ["forums", "Fóruns das turmas"],
  ["forumTopics", "Tópicos no fórum"],
  ["forumPosts", "Publicações no fórum"],
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("pt-BR");
}

interface Props {
  user: ManagedUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PermanentDeleteUserModal({ user, onClose, onSuccess }: Props) {
  const [details, setDetails] = useState<ManagedUser | null>(null);
  const [impact, setImpact] = useState<UserDeletionImpact | null>(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [impactError, setImpactError] = useState("");
  const [impactRevision, setImpactRevision] = useState(0);
  const [phrase, setPhrase] = useState("");
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLFormElement>(null);
  const busyRef = useRef(false);
  const dismissRef = useRef<() => void>(onClose);
  dismissRef.current = done ? onSuccess : onClose;

  useEffect(() => {
    let active = true;
    setImpactLoading(true);
    setImpactError("");
    Promise.all([
      adminService.consultarImpacto(user.userId),
      adminService.buscarUsuario(user.userId),
    ])
      .then(([impactData, userData]) => {
        if (!active) return;
        setImpact(impactData);
        setDetails(userData);
      })
      .catch((err) => {
        if (active) setImpactError(adminErrorMessage(err));
      })
      .finally(() => {
        if (active) setImpactLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user.userId, impactRevision]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) dismissRef.current();
      if (event.key !== "Tab") return;
      const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
        "textarea:not(:disabled), input:not(:disabled), button:not(:disabled)",
      );
      if (!elements?.length) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", keyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyDown);
      previousFocus?.focus();
    };
  }, []);

  const current = details ?? user;
  const isInactive = current.status === "inactive";
  const noBlockers = impact?.canDelete === true;
  const phraseOk = phrase.trim() === CONFIRMATION_PHRASE;
  const reasonOk = reason.trim().length > 0;
  const passwordOk = password.length > 0;
  const canSubmit =
    PERMANENT_DELETE_ENABLED &&
    isInactive &&
    noBlockers &&
    phraseOk &&
    reasonOk &&
    passwordOk &&
    !loading &&
    !done;

  const pending = [
    !PERMANENT_DELETE_ENABLED && "A exclusão definitiva ainda não foi liberada no sistema.",
    !isInactive && "Desative o usuário antes de excluí-lo definitivamente.",
    impactLoading && "Aguarde a verificação das dependências.",
    !impactLoading && !noBlockers && "Resolva as dependências que impedem a exclusão.",
    !phraseOk && `Digite a frase ${CONFIRMATION_PHRASE}.`,
    !reasonOk && "Informe o motivo da exclusão.",
    !passwordOk && "Informe a sua senha de administrador.",
  ].filter(Boolean) as string[];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    setError("");
    try {
      await adminService.excluirDefinitivamente(user.userId, {
        reason: reason.trim(),
        confirm: true,
        password,
      });
      setPassword("");
      setDone(true);
    } catch (err) {
      setError(adminErrorMessage(err));
      setPassword("");
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  const registration = current.registrationStudent ?? current.registrationTeacher;
  const impactItems = impact
    ? IMPACT_LABELS.filter(([key]) => Number(impact[key]) > 0)
    : [];

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busyRef.current) dismissRef.current();
      }}
    >
      <DeleteDialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="permanent-delete-title"
        aria-describedby="permanent-delete-warning"
        tabIndex={-1}
        onSubmit={submit}
      >
        <h2 id="permanent-delete-title">Excluir usuário definitivamente</h2>

        <div id="permanent-delete-warning" className="delete-warning">
          <FiAlertTriangle size={22} aria-hidden="true" />
          <span>
            Esta operação é definitiva e não pode ser desfeita. Os dados do usuário serão
            removidos permanentemente.
          </span>
        </div>

        <p className="delete-note">
          <strong>Isto não é desativar.</strong> A desativação preserva todo o histórico e pode
          ser revertida. A exclusão definitiva remove os dados para sempre.
        </p>

        <h3 className="delete-section-title">Usuário selecionado</h3>
        <dl className="admin-user-details">
          <dt>Nome</dt>
          <dd>{user.name}</dd>
          <dt>E-mail</dt>
          <dd>{user.email}</dd>
          <dt>Perfil</dt>
          <dd>{PROFILE_LABEL[user.type]}</dd>
          {registration && (
            <>
              <dt>{user.type === "student" ? "Matrícula" : "SIAPE"}</dt>
              <dd>{registration}</dd>
            </>
          )}
          <dt>Status</dt>
          <dd>{isInactive ? "Inativo" : "Ativo"}</dd>
          <dt>Cadastro</dt>
          <dd>{formatDate(user.createdAt)}</dd>
          {isInactive && (
            <>
              <dt>Desativado em</dt>
              <dd>{formatDate(current.deactivatedAt)}</dd>
              <dt>Motivo da desativação</dt>
              <dd>{current.deactivationReason || "—"}</dd>
            </>
          )}
        </dl>

        <h3 className="delete-section-title">Verificações de segurança</h3>
        <ul className="delete-checks">
          <li data-ok={isInactive}>
            {isInactive ? (
              <FiCheckCircle aria-hidden="true" />
            ) : (
              <FiXCircle aria-hidden="true" />
            )}
            <span>
              {isInactive
                ? "O usuário está inativo."
                : "O usuário está ativo. Desative-o antes de excluir definitivamente."}
            </span>
          </li>
          <li data-ok={impactLoading ? undefined : noBlockers}>
            {impactLoading ? null : noBlockers ? (
              <FiCheckCircle aria-hidden="true" />
            ) : (
              <FiXCircle aria-hidden="true" />
            )}
            <span>
              {impactLoading && "Verificando dependências..."}
              {!impactLoading && impactError && "Não foi possível verificar as dependências."}
              {!impactLoading && !impactError && noBlockers && "Nenhuma dependência impede a exclusão."}
              {!impactLoading && !impactError && impact && !noBlockers && "Existem dependências que impedem a exclusão."}
            </span>
          </li>
        </ul>

        {impactLoading && <p role="status">Carregando informações de impacto...</p>}
        {impactError && (
          <div role="alert">
            <p>{impactError}</p>
            <button type="button" onClick={() => setImpactRevision((value) => value + 1)}>
              Tentar novamente
            </button>
          </div>
        )}
        {impact && !noBlockers && impact.blockedReasons.length > 0 && (
          <div role="alert">
            <strong>Exclusão bloqueada:</strong>
            <ul className="delete-pending">
              {impact.blockedReasons.map((blockedReason) => (
                <li key={blockedReason}>{blockedReason}</li>
              ))}
            </ul>
          </div>
        )}
        {impact && impactItems.length > 0 && (
          <dl className="deletion-impact-list">
            {impactItems.map(([key, label]) => (
              <div key={key} style={{ display: "contents" }}>
                <dt>{label}</dt>
                <dd>{String(impact[key])}</dd>
              </div>
            ))}
          </dl>
        )}

        {!PERMANENT_DELETE_ENABLED && (
          <p className="delete-note" role="note">
            A exclusão definitiva ainda não foi liberada no sistema. Você pode revisar as
            informações e preencher os campos, mas a confirmação permanece desabilitada.
          </p>
        )}

        {done ? (
          <p className="delete-success" role="status">
            Usuário excluído definitivamente com sucesso.
          </p>
        ) : (
          <>
            <div className="delete-field">
              <label htmlFor="permanent-delete-phrase">
                Para confirmar, digite{" "}
                <span className="delete-phrase">{CONFIRMATION_PHRASE}</span>
              </label>
              <input
                id="permanent-delete-phrase"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={phrase}
                onChange={(event) => setPhrase(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="delete-field">
              <label htmlFor="permanent-delete-reason">Motivo da exclusão (obrigatório)</label>
              <textarea
                id="permanent-delete-reason"
                maxLength={MAX_REASON_LENGTH}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                disabled={loading}
              />
              <small>
                {reason.length}/{MAX_REASON_LENGTH} caracteres
              </small>
            </div>

            <div className="delete-field">
              <label htmlFor="permanent-delete-password">Sua senha de administrador</label>
              <input
                id="permanent-delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p role="alert">{error}</p>}
            {loading && <p role="status">Excluindo usuário...</p>}

            {pending.length > 0 && (
              <ul className="delete-pending" id="permanent-delete-pending">
                {pending.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="user-status-actions">
          {done ? (
            <button type="button" onClick={onSuccess}>
              Fechar
            </button>
          ) : (
            <>
              <button type="button" disabled={loading} onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="danger"
                disabled={!canSubmit}
                aria-describedby={pending.length > 0 ? "permanent-delete-pending" : undefined}
              >
                {loading ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </>
          )}
        </div>
      </DeleteDialog>
    </Backdrop>
  );
}
