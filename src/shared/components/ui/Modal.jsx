import "./../../../shared/styles/components/modal.css";

export default function Modal({
  open,
  type = "info",
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancel = false,
}) {
  if (!open) return null;

  return (
    <div className="modal-light-overlay">
      <div className="modal-light-box">

        {/* Ícono según tipo */}
        <div className={`modal-icon icon-${type}`}></div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          {showCancel && (
            <button className="modal-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}

          <button className="modal-btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

