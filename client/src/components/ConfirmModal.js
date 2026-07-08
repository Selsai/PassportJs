import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

// Modale de confirmation générique (overlay + carte centrée).
// `message` peut être une string ou du JSX (ex. pour mettre le titre en gras).
const ConfirmModal = ({
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel
}) => {
  // Ferme la modale avec Échap, et bloque le scroll de la page en arrière-plan
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmModalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalIcon">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>

        <h3 id="confirmModalTitle">{title}</h3>
        <p>{message}</p>

        <div className="modalActions">
          <button type="button" className="oauthBtn secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="dangerBtn" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;