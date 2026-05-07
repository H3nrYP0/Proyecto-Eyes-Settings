import { useState, useEffect } from "react";
import { getMisCitas, cancelarCita } from "./citasLandingService";

// Material UI icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WarningIcon from "@mui/icons-material/Warning";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// Formatear fecha de YYYY-MM-DD a DD/MM/AAAA
const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Formatear hora de HH:MM:SS a HH:MM AM/PM
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return "";
  let hours, minutes;
  
  if (timeString.includes(":")) {
    const parts = timeString.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parts[1];
  } else {
    return timeString;
  }
  
  const ampm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

// Mapeo de estado a clases CSS y texto
const estadoInfo = {
  1: { texto: "Confirmada", clase: "estado-confirmada", icono: <CheckCircleIcon sx={{ fontSize: "0.8rem" }} />, ordenGrupo: 1 },
  2: { texto: "Pendiente", clase: "estado-pendiente", icono: <ScheduleIcon sx={{ fontSize: "0.8rem" }} />, ordenGrupo: 2 },
  3: { texto: "Completada", clase: "estado-completada", icono: <CheckCircleIcon sx={{ fontSize: "0.8rem" }} />, ordenGrupo: 3 },
  4: { texto: "Cancelada", clase: "estado-cancelada", icono: <CloseIcon sx={{ fontSize: "0.8rem" }} />, ordenGrupo: 4 },
};

// Modal de confirmación
const ConfirmCancelModal = ({ cita, onConfirm, onClose }) => {
  const fechaFormateada = formatDate(cita.fecha);
  const horaFormateada = formatTimeToAMPM(cita.hora);

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>
          <WarningIcon sx={{ fontSize: "3rem" }} />
        </div>
        <h3>Cancelar cita</h3>
        <p>¿Estás seguro de cancelar esta cita?</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio_nombre}</p>
          <p><strong>Fecha:</strong> {fechaFormateada}</p>
          <p><strong>Hora:</strong> {horaFormateada}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button className="success-btn" style={{ background: "#dc2626" }} onClick={onConfirm}>
            Sí, cancelar
          </button>
          <button className="success-btn" style={{ background: "#4e6e6e" }} onClick={onClose}>
            No, mantener
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de éxito al cancelar
const CancelSuccessModal = ({ cita, onClose, onSendWhatsApp }) => {
  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <CheckCircleIcon sx={{ fontSize: "3rem", color: "#15803d" }} />
        </div>
        <h3>Cita cancelada</h3>
        <p>Tu cita ha sido cancelada correctamente.</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio}</p>
          <p><strong>Fecha:</strong> {cita.fecha}</p>
          <p><strong>Hora:</strong> {cita.hora}</p>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#4e6e6e" }}>
          ¿Quieres notificar a la óptica por WhatsApp?
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button className="success-btn" onClick={onSendWhatsApp}>
            <WhatsAppIcon sx={{ fontSize: "1rem", marginRight: "0.3rem", verticalAlign: "middle" }} />
            Enviar WhatsApp
          </button>
          <button className="success-btn" style={{ background: "#4e6e6e" }} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const MisCitas = ({ readOnly = false, onCitaCancelada, refreshKey }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);
  const [citaParaCancelar, setCitaParaCancelar] = useState(null);
  const [citaCanceladaExito, setCitaCanceladaExito] = useState(null);

  // Ordenar y agrupar las citas
  const procesarCitas = (citasArray) => {
    // 1. Ordenar por fecha y hora ascendente (las más cercanas primero)
    const ordenadas = [...citasArray].sort((a, b) => {
      // Comparar fecha completa + hora
      const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
      const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
      return fechaHoraA - fechaHoraB;
    });

    // 2. Agrupar por estado según ordenGrupo (1: Confirmada, 2: Pendiente, 3: Completada, 4: Cancelada)
    const grupos = {
      1: [], // Confirmadas (activas)
      2: [], // Pendientes (activas)
      3: [], // Completadas (inactivas)
      4: [], // Canceladas (inactivas)
    };

    ordenadas.forEach(cita => {
      const estadoId = cita.estado_cita_id;
      if (grupos[estadoId]) grupos[estadoId].push(cita);
      else grupos[4].push(cita); // por si llega un estado desconocido, va a canceladas
    });

    // Unir grupos: primero activas (1 y 2), luego inactivas (3 y 4)
    return [...grupos[1], ...grupos[2], ...grupos[3], ...grupos[4]];
  };

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const data = await getMisCitas();
      const procesadas = procesarCitas(data);
      setCitas(procesadas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial y cuando cambia refreshKey
  useEffect(() => {
    if (!readOnly) {
      cargarCitas();
    }
  }, [readOnly, refreshKey]); // 👈 refreshKey ya está incluido

  const handleConfirmCancel = async () => {
    if (!citaParaCancelar) return;
    setCancelandoId(citaParaCancelar.id);
    try {
      await cancelarCita(citaParaCancelar.id);
      await cargarCitas(); // Recargar la lista ya ordenada
      setCitaCanceladaExito({
        servicio: citaParaCancelar.servicio_nombre,
        fecha: formatDate(citaParaCancelar.fecha),
        hora: formatTimeToAMPM(citaParaCancelar.hora),
      });
      setCitaParaCancelar(null);
      if (onCitaCancelada) onCitaCancelada();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelandoId(null);
    }
  };

  const handleSendWhatsApp = () => {
    if (!citaCanceladaExito) return;
    const telefonoOptica = "573006139449";
    const mensaje = `Hola, he cancelado mi cita del ${citaCanceladaExito.fecha} a las ${citaCanceladaExito.hora} para el servicio de ${citaCanceladaExito.servicio}. Gracias.`;
    const url = `https://wa.me/${telefonoOptica}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (readOnly) {
    return (
      <div className="admin-readonly-message">
        <p>Lista de citas no disponible en modo administrador.</p>
        <p>Para ver tus citas, utiliza una cuenta de cliente.</p>
      </div>
    );
  }

  if (loading) return <div className="mis-citas-loading">Cargando tus citas...</div>;
  if (error) return <div className="mis-citas-error">Error: {error}</div>;
  if (citas.length === 0) return <div className="mis-citas-empty">No tienes citas agendadas aún.</div>;

  return (
    <>
      <div className="mis-citas-container">
        <h3><EventIcon sx={{ fontSize: "1.2rem", marginRight: "0.5rem", verticalAlign: "middle" }} /> Mis citas</h3>
        <div className="citas-grid">
          {citas.map(cita => {
            const estado = estadoInfo[cita.estado_cita_id] || { texto: "Desconocido", clase: "", icono: <MedicalServicesIcon sx={{ fontSize: "0.8rem" }} /> };
            const esCancelable = cita.estado_cita_id === 1 || cita.estado_cita_id === 2;
            const fechaFormateada = formatDate(cita.fecha);
            const horaFormateada = formatTimeToAMPM(cita.hora);

            return (
              <div key={cita.id} className={`cita-card ${estado.clase}`}>
                <div className="cita-header">
                  <span className="cita-servicio">{cita.servicio_nombre}</span>
                  <span className="cita-estado">{estado.icono} {estado.texto}</span>
                </div>
                <div className="cita-body">
                  <div className="cita-fecha"><EventIcon sx={{ fontSize: "0.8rem", marginRight: "0.3rem", verticalAlign: "middle" }} /> {fechaFormateada}</div>
                  <div className="cita-hora"><AccessTimeIcon sx={{ fontSize: "0.8rem", marginRight: "0.3rem", verticalAlign: "middle" }} /> {horaFormateada}</div>
                </div>
                {esCancelable && (
                  <button
                    className="cancelar-btn"
                    onClick={() => setCitaParaCancelar(cita)}
                    disabled={cancelandoId === cita.id}
                  >
                    {cancelandoId === cita.id ? "Cancelando..." : "Cancelar cita"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {citaParaCancelar && (
        <ConfirmCancelModal
          cita={citaParaCancelar}
          onConfirm={handleConfirmCancel}
          onClose={() => setCitaParaCancelar(null)}
        />
      )}

      {citaCanceladaExito && (
        <CancelSuccessModal
          cita={citaCanceladaExito}
          onClose={() => setCitaCanceladaExito(null)}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}
    </>
  );
};

export default MisCitas;