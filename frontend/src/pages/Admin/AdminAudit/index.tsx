import { useEffect, useState } from "react";
import axios from "axios";
import {
  adminErrorMessage,
  adminService,
  AUDIT_API_AVAILABLE,
} from "../../../services/adminService";
import type { AuditLogEntry, AuditLogPage } from "../../../types/audit";
import AuditDetailsModal from "./AuditDetailsModal";
import { actionLabel, formatDateTime, userRefName } from "./labels";
import { AuditPanel } from "./styles";

const PAGE_SIZE = 10;

function auditErrorMessage(err: unknown) {
  if (axios.isAxiosError(err) && err.response?.status === 404) {
    return "A consulta de auditoria ainda não está disponível no servidor. Tente novamente mais tarde.";
  }
  return adminErrorMessage(err);
}

export default function AdminAudit() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [meta, setMeta] = useState<AuditLogPage["meta"] | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    adminService
      .listarAuditoria({ page, limit: PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        if (page > Math.max(1, result.meta.totalPages)) {
          setPage(Math.max(1, result.meta.totalPages));
          return;
        }
        setEntries(result.data);
        setMeta(result.meta);
      })
      .catch((err) => {
        if (active) setError(auditErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, revision]);

  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  return (
    <AuditPanel>
      <header className="audit-heading">
        <h1>Auditoria</h1>
        <p>Consulte as ações administrativas realizadas no ProgeteQuest.</p>
      </header>

      {!AUDIT_API_AVAILABLE && (
        <p className="audit-mock-notice" role="note">
          Dados simulados: a consulta de auditoria ainda não está disponível no servidor. Os
          registros abaixo são apenas exemplos.
        </p>
      )}

      {loading && <p role="status">Carregando registros de auditoria...</p>}

      {!loading && error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRevision((value) => value + 1)}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p role="status">Nenhum registro de auditoria encontrado.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="admin-users-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Ação</th>
                <th scope="col">Administrador</th>
                <th scope="col">Usuário afetado</th>
                <th scope="col">
                  <span className="sr-only">Detalhes</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.auditId}>
                  <td className="audit-date">{formatDateTime(entry.createdAt)}</td>
                  <td>
                    <span className="audit-action-badge" data-action={entry.action}>
                      {actionLabel(entry.action)}
                    </span>
                  </td>
                  <td className="audit-user">
                    <strong>{userRefName(entry.admin)}</strong>
                    {entry.admin.email && <small>{entry.admin.email}</small>}
                  </td>
                  <td className="audit-user">
                    <strong>{userRefName(entry.targetUser)}</strong>
                    <small>{entry.targetUser.email ?? `ID ${entry.targetUser.userId}`}</small>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="audit-details-button"
                      aria-label={`Ver detalhes: ${actionLabel(entry.action)} em ${formatDateTime(entry.createdAt)}`}
                      onClick={() => setSelected(entry)}
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meta && (
            <nav className="audit-pagination" aria-label="Paginação da auditoria">
              <span>
                {meta.totalItems} registros · Página {Math.min(page, totalPages)} de {totalPages}
              </span>
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
        </div>
      )}

      {selected && <AuditDetailsModal entry={selected} onClose={() => setSelected(null)} />}
    </AuditPanel>
  );
}
