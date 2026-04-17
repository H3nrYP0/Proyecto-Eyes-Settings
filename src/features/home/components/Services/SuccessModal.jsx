import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessModal = ({ cita, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <CheckCircleIcon sx={{ fontSize: "3rem", color: "#15803d" }} />
        </div>
        <h3>Cita agendada</h3>
        <p>Hemos registrado tu cita exitosamente.</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio}</p>
          <p><strong>Fecha:</strong> {formatDate(cita.fecha)}</p>
          <p><strong>Hora:</strong> {cita.hora}</p>
          <p><strong>Paciente:</strong> {cita.cliente}</p>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#4e6e6e" }}>
          Te enviaremos un recordatorio por WhatsApp.
        </p>
        <button className="success-btn" onClick={onClose}>
          Entendido, gracias
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;