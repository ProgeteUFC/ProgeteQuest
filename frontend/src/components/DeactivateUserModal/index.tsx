import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiUserX } from "react-icons/fi";
import { adminService } from "../../services/adminService";
import {
  Actions,
  Backdrop,
  CancelButton,
  Card,
  ConfirmRow,
  DeactivateButton,
  ErrorMessage,
  Field,
  FieldHint,
  Header,
  IconCircle,
  InfoBox,
  NotDeletionBox,
  Subtitle,
} from "./styles";

const MAX_REASON_LENGTH = 500;

interface DeactivateUserModalProps {
  open: boolean;
  userId: string;
  userName?: string;
  onClose: () => void;
  onDeactivated: () => void;
}

function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Não foi possível conectar ao servidor. Tente novamente.";
    }
    const message = err.response.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (err.response.status === 403) {
      return "Você não tem permissão para desativar usuários.";
    }
  }
  return "Não foi possível desativar o usuário. Tente novamente.";
}

export default function DeactivateUserModal(props: DeactivateUserModalProps) {
  if (!props.open) return null;
  return <ModalContent {...props} />;
}

function ModalContent({
  userId,
  userName,
  onClose,
  onDeactivated,
}: DeactivateUserModalProps) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const trimmedReason = reason.trim();
  const canSubmit = trimmedReason.length > 0 && confirmed && !loading;
  const displayName = userName ?? "este usuário";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loadingRef.current) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      await adminService.desativarUsuario(userId, trimmedReason, token);
      onDeactivated();
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <Backdrop
      onMouseDown={(event) =>
        event.target === event.currentTarget && !loading && onClose()
      }
    >
      <Card
        as="form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-user-title"
        aria-describedby="deactivate-user-description"
        onSubmit={handleSubmit}
      >
        <Header>
          <IconCircle aria-hidden="true">
            <FiUserX size={26} />
          </IconCircle>
          <h2 id="deactivate-user-title">Desativar usuário</h2>
        </Header>

        <Subtitle id="deactivate-user-description">
          Você está prestes a desativar <strong>{displayName}</strong>.
        </Subtitle>

        <InfoBox>
          <h3>O que acontece ao desativar</h3>
          <ul>
            <li>O usuário perde o acesso ao sistema imediatamente.</li>
            <li>
              Todo o histórico (turmas, atividades, check-ins e postagens) é
              preservado.
            </li>
            <li>A conta pode ser reativada por um administrador.</li>
          </ul>
        </InfoBox>

        <NotDeletionBox>
          <h3>Desativar não é excluir</h3>
          Nenhum dado é apagado. Já a exclusão remove os dados
          permanentemente e não pode ser desfeita. Não é isso que será feito
          aqui.
        </NotDeletionBox>

        <Field>
          <label htmlFor="deactivate-user-reason">
            Motivo da desativação (obrigatório)
          </label>
          <textarea
            id="deactivate-user-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={MAX_REASON_LENGTH}
            placeholder="Ex.: Professor desligado da instituição"
            disabled={loading}
            autoFocus
          />
          <FieldHint>
            <span>
              Fica registrado com a data e o administrador responsável.
            </span>
            <span>
              {reason.length}/{MAX_REASON_LENGTH}
            </span>
          </FieldHint>
        </Field>

        <ConfirmRow>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            disabled={loading}
          />
          <span>
            Entendo que {displayName} perderá o acesso ao sistema, mas que o
            histórico será mantido.
          </span>
        </ConfirmRow>

        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

        <Actions>
          <CancelButton type="button" onClick={onClose} disabled={loading}>
            Cancelar
          </CancelButton>
          <DeactivateButton type="submit" disabled={!canSubmit}>
            {loading ? "Desativando..." : "Desativar usuário"}
          </DeactivateButton>
        </Actions>
      </Card>
    </Backdrop>
  );
}
