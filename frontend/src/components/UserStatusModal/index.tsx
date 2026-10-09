import { useEffect, useRef, useState } from "react";
import {
  adminErrorMessage,
  adminService,
  type ManagedUser,
} from "../../services/adminService";
import { Backdrop, Dialog } from "./styles";

interface Props {
  user: ManagedUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserStatusModal({ user, onClose, onSuccess }: Props) {
  const deactivate = user.status === "active";
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLFormElement>(null);
  const busyRef = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current
      ?.querySelector<HTMLElement>("textarea, input, button")
      ?.focus();
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) closeRef.current();
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busyRef.current || !confirmed || (deactivate && !reason.trim())) return;
    busyRef.current = true;
    setLoading(true);
    setError("");
    try {
      if (deactivate)
        await adminService.desativarUsuario(user.userId, reason.trim());
      else await adminService.reativarUsuario(user.userId);
      onSuccess();
    } catch (err) {
      setError(adminErrorMessage(err));
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  return (
    <Backdrop
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busyRef.current) onClose();
      }}
    >
      <Dialog
        ref={dialogRef}
        className="user-status-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-status-title"
        aria-describedby="user-status-description"
        onSubmit={submit}
      >
        <h2 id="user-status-title">
          {deactivate ? "Desativar" : "Reativar"} usuário
        </h2>
        <p id="user-status-description">
          {user.name} — {user.email}
        </p>
        {deactivate ? (
          <>
            <p>
              O usuário perderá o acesso ao sistema. Todo o histórico, incluindo
              turmas, atividades, check-ins e postagens, será preservado.
            </p>
            <div className="user-status-info">
              <strong>Desativar não é excluir.</strong> Nenhum dado será
              apagado. A conta poderá ser reativada por um administrador. A
              exclusão definitiva é uma operação separada.
            </div>
            <label htmlFor="user-status-reason">
              Motivo da desativação (obrigatório)
            </label>
            <textarea
              id="user-status-reason"
              required
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            />
            <small>{reason.length}/500 caracteres</small>
          </>
        ) : (
          <p>
            O usuário poderá fazer login novamente. Seu histórico e seus
            vínculos serão mantidos.
          </p>
        )}
        <label className="user-status-confirm">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={loading}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          {deactivate
            ? "Confirmo a desativação e entendo que o histórico será mantido."
            : "Confirmo a reativação do acesso deste usuário."}
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="user-status-actions">
          <button type="button" disabled={loading} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className={deactivate ? "danger" : ""}
            disabled={loading || !confirmed || (deactivate && !reason.trim())}
          >
            {loading
              ? "Salvando..."
              : deactivate
                ? "Desativar usuário"
                : "Reativar usuário"}
          </button>
        </div>
      </Dialog>
    </Backdrop>
  );
}
