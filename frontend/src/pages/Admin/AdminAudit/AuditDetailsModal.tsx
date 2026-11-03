import { useEffect, useRef } from "react";
import type { AuditLogEntry, AuditUserRef } from "../../../types/audit";
import { Backdrop } from "../../../components/UserStatusModal/styles";
import { AuditDialog } from "./styles";
import {
  actionLabel,
  fieldLabel,
  formatAuditValue,
  formatDateTime,
  isFieldChange,
  resourceLabel,
  userRefName,
} from "./labels";

interface Props {
  entry: AuditLogEntry;
  onClose: () => void;
}

function UserRef({ refData }: { refData: AuditUserRef }) {
  return (
    <>
      {userRefName(refData)}
      {refData.email ? ` (${refData.email})` : ` (ID ${refData.userId})`}
    </>
  );
}

export default function AuditDetailsModal({ entry, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keyDown);
      previousFocus?.focus();
    };
  }, []);

  const changeEntries = Object.entries(entry.changes ?? {});
  const diffs = changeEntries.filter(([, value]) => isFieldChange(value));
  const recorded = changeEntries.filter(([, value]) => !isFieldChange(value));
  const resources = Object.entries(entry.resourceIds ?? {});

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <AuditDialog
        as="div"
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-details-title"
      >
        <h2 id="audit-details-title">{actionLabel(entry.action)}</h2>
        <p>{formatDateTime(entry.createdAt)}</p>

        <dl className="admin-user-details">
          <dt>Administrador</dt>
          <dd>
            <UserRef refData={entry.admin} />
          </dd>
          <dt>Usuário afetado</dt>
          <dd>
            <UserRef refData={entry.targetUser} />
          </dd>
          <dt>Motivo</dt>
          <dd>{entry.reason || "Não informado"}</dd>
        </dl>

        <h3>Alterações</h3>
        {entry.action === "PASSWORD_RESET" && (
          <p className="audit-note">Por segurança, a nova senha não é registrada na auditoria.</p>
        )}
        {diffs.length > 0 && (
          <table className="audit-changes">
            <thead>
              <tr>
                <th scope="col">Campo</th>
                <th scope="col">Antes</th>
                <th scope="col">Depois</th>
              </tr>
            </thead>
            <tbody>
              {diffs.map(([key, value]) => {
                const change = value as { before: unknown; after: unknown };
                return (
                  <tr key={key}>
                    <th scope="row">{fieldLabel(key)}</th>
                    <td>{formatAuditValue(key, change.before)}</td>
                    <td>{formatAuditValue(key, change.after)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {recorded.length > 0 && (
          <dl className="admin-user-details">
            {recorded.map(([key, value]) => (
              <div key={key} style={{ display: "contents" }}>
                <dt>{fieldLabel(key)}</dt>
                <dd>{formatAuditValue(key, value)}</dd>
              </div>
            ))}
          </dl>
        )}
        {changeEntries.length === 0 && <p>Nenhuma alteração registrada.</p>}

        <h3>Recursos envolvidos</h3>
        {resources.length > 0 ? (
          <dl className="admin-user-details">
            {resources.map(([key, value]) => (
              <div key={key} style={{ display: "contents" }}>
                <dt>{resourceLabel(key)}</dt>
                <dd>{formatAuditValue(key, value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>Nenhum recurso registrado.</p>
        )}

        <div className="user-status-actions">
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </AuditDialog>
    </Backdrop>
  );
}
