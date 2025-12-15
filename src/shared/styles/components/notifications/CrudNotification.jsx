// src/shared/components/notifications/CrudNotification.jsx
import './CrudNotification.css';

export default function CrudNotification({ message, type = 'success', isVisible, onClose }) {
  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'var(--success-color, #d4ffd8)' 
    : 'var(--error-color, #ffe1e1)';

  const borderColor = type === 'success' 
    ? 'var(--success-border, #b8e6cb)' 
    : 'var(--error-border, #f5c2c2)';

  const textColor = type === 'success' 
    ? 'var(--success-text, #ffffffff)' 
    : 'var(--error-text, #ffffffff)';

  return (
    <div 
      className="crud-notification"
      style={{
        background: bgColor,
        borderColor: borderColor,
        color: textColor
      }}
    >
      <span className="crud-notification-message">{message}</span>
      <button 
        className="crud-notification-close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}





