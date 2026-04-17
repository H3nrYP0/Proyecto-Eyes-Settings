// home/components/Services/SuccessModal.jsx
const SuccessModal = ({ cita, onClose }) => {
  // Convierte YYYY-MM-DD a DD/MM/AAAA
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h3>¡Cita agendada!</h3>
        <p>Hemos registrado tu cita exitosamente.</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio}</p>
          <p><strong>Fecha:</strong> {formatDate(cita.fecha)}</p>
          <p><strong>Hora:</strong> {cita.hora}</p>
          <p><strong>Cliente:</strong> {cita.cliente}</p>
        </div>
        <button className="success-btn" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;