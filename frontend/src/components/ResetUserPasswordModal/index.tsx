import { useEffect, useRef, useState, type FormEvent } from "react";
import { adminErrorMessage, adminService, type ManagedUser } from "../../services/adminService";
import { Dialog } from "../UserStatusModal/styles";
import { PasswordResetDialog } from "./styles";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;
const MAX_REASON_LENGTH = 500;

function validPassword(password: string) {
  if (password.length > MAX_PASSWORD_BYTES || !password.trim()) return false;

  // O class-validator conta o seletor de apresentação junto ao caractere anterior.
  const selectors = password.match(/[^\uFE0E\uFE0F][\uFE0E\uFE0F]/g) ?? [];
  const length = Array.from(password).length - selectors.length;
  return length >= MIN_PASSWORD_LENGTH && new TextEncoder().encode(password).byteLength <= MAX_PASSWORD_BYTES;
}

interface Props {
  user: Pick<ManagedUser, "userId" | "name" | "email">;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResetUserPasswordModal({ user, onClose, onSuccess }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const sending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  function close() {
    if (sending.current) return;
    if (passwordRef.current) passwordRef.current.value = "";
    if (confirmationRef.current) confirmationRef.current.value = "";
    dialogRef.current?.close();
    onClose();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = passwordRef.current;
    const confirmation = confirmationRef.current;
    const reason = reasonRef.current;
    if (sending.current || !dialogRef.current?.open || !password || !confirmation || !reason) return;

    const newPassword = password.value;
    if (!validPassword(newPassword)) {
      setError("Informe uma senha com pelo menos 8 caracteres e no máximo 72 bytes que contenha algo além de espaços.");
      password.focus();
      return;
    }
    if (newPassword !== confirmation.value) {
      setError("As senhas devem coincidir.");
      confirmation.focus();
      return;
    }
    if (!reason.value.trim() || reason.value.length > MAX_REASON_LENGTH) {
      setError(`Informe um motivo de até ${MAX_REASON_LENGTH} caracteres.`);
      reason.focus();
      return;
    }

    sending.current = true;
    setLoading(true);
    setError("");
    password.value = "";
    confirmation.value = "";

    try {
      await adminService.redefinirSenha(user.userId, newPassword, reason.value.trim());
    } catch (err) {
      setError(adminErrorMessage(err));
      return;
    } finally {
      sending.current = false;
      setLoading(false);
    }

    if (dialogRef.current?.open) {
      dialogRef.current.close();
      onSuccess();
    }
  }

  return (
    <PasswordResetDialog
      ref={dialogRef}
      aria-labelledby="reset-password-title"
      aria-describedby="reset-password-user"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <Dialog noValidate autoComplete="off" onSubmit={submit} onInput={() => setError("")}>
        <h2 id="reset-password-title">Redefinir senha</h2>
        <p id="reset-password-user">{user.name} · {user.email}</p>

        <div className="reset-password-field">
          <label htmlFor="reset-password-new">Nova senha</label>
          <input
            id="reset-password-new"
            ref={passwordRef}
            type="password"
            autoComplete="new-password"
            aria-describedby="reset-password-rules"
            required
            disabled={loading}
          />
          <small id="reset-password-rules">Mínimo de 8 caracteres e máximo de 72 bytes em UTF-8.</small>
        </div>
        <div className="reset-password-field">
          <label htmlFor="reset-password-confirmation">Repita a nova senha</label>
          <input
            id="reset-password-confirmation"
            ref={confirmationRef}
            type="password"
            autoComplete="new-password"
            required
            disabled={loading}
          />
        </div>
        <div className="reset-password-field">
          <label htmlFor="reset-password-reason">Motivo (até {MAX_REASON_LENGTH} caracteres)</label>
          <textarea
            id="reset-password-reason"
            ref={reasonRef}
            maxLength={MAX_REASON_LENGTH}
            required
            disabled={loading}
          />
        </div>

        {error && <p role="alert">{error}</p>}
        {loading && <p role="status">Redefinindo senha...</p>}
        <div className="user-status-actions">
          <button type="button" disabled={loading} onClick={close}>Cancelar</button>
          <button type="submit" disabled={loading}>Redefinir senha</button>
        </div>
      </Dialog>
    </PasswordResetDialog>
  );
}
